(function () {
  var cfg = window.ASB_CONFIG;
  var form = document.getElementById("inscricao");
  var $ = function (id) { return document.getElementById(id); };
  var NAO_POSSUO = "Não possuo";

  // ---------- Origem da visita (UTMs dos anúncios) ----------
  var UTMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];
  var origem = {};
  try {
    var qs = new URLSearchParams(location.search);
    var salvo = JSON.parse(sessionStorage.getItem("asb_utm") || "{}");
    UTMS.forEach(function (k) { origem[k] = qs.get(k) || salvo[k] || ""; });
    sessionStorage.setItem("asb_utm", JSON.stringify(origem));
  } catch (e) {
    UTMS.forEach(function (k) { origem[k] = ""; });
  }

  // ---------- Máscaras ----------
  var soDigitos = function (v) { return v.replace(/\D/g, ""); };
  var mascaras = {
    cpf: function (v) {
      v = soDigitos(v).slice(0, 11);
      return v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    },
    whatsapp: function (v) {
      v = soDigitos(v).slice(0, 11);
      if (v.length <= 2) return v.length ? "(" + v : v;
      if (v.length <= 6) return "(" + v.slice(0, 2) + ") " + v.slice(2);
      if (v.length <= 10) return "(" + v.slice(0, 2) + ") " + v.slice(2, 6) + "-" + v.slice(6);
      return "(" + v.slice(0, 2) + ") " + v.slice(2, 7) + "-" + v.slice(7);
    },
    cep: function (v) {
      v = soDigitos(v).slice(0, 8);
      return v.length > 5 ? v.slice(0, 5) + "-" + v.slice(5) : v;
    },
    cnpj: function (v) {
      if (v === NAO_POSSUO) return v;
      v = soDigitos(v).slice(0, 14);
      return v
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    },
  };
  Object.keys(mascaras).forEach(function (id) {
    $(id).addEventListener("input", function (e) {
      e.target.value = mascaras[id](e.target.value);
    });
  });

  // ---------- Validações ----------
  function cpfValido(v) {
    var c = soDigitos(v);
    if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
    for (var t = 9; t < 11; t++) {
      var s = 0;
      for (var i = 0; i < t; i++) s += +c[i] * (t + 1 - i);
      if (((s * 10) % 11) % 10 !== +c[t]) return false;
    }
    return true;
  }
  var regras = {
    nome: function (v) { return v.trim().split(/\s+/).length >= 2 || "Informe nome e sobrenome."; },
    cpf: function (v) { return cpfValido(v) || "CPF inválido."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "E-mail inválido."; },
    whatsapp: function (v) { return soDigitos(v).length >= 10 || "Informe o WhatsApp com DDD."; },
    cep: function (v) { return soDigitos(v).length === 8 || "CEP inválido."; },
    cnpj: function (v) { return v === NAO_POSSUO || soDigitos(v).length === 14 || "CNPJ inválido (ou marque “Não possuo”)."; },
  };

  function mostrarErro(campo, msg) {
    var box = campo.closest(".campo");
    if (!box) return;
    var el = box.querySelector(".erro");
    if (!el) {
      el = document.createElement("small");
      el.className = "erro";
      el.id = campo.id + "-erro";
      box.appendChild(el);
    }
    el.textContent = msg || "";
    box.classList.toggle("invalido", !!msg);
    campo.setAttribute("aria-invalid", msg ? "true" : "false");
    if (msg) campo.setAttribute("aria-describedby", el.id);
  }

  function validarCampo(campo) {
    var v = campo.value;
    var msg = "";
    if (campo.required && !v.trim()) msg = "Campo obrigatório.";
    else if (v.trim() && regras[campo.id]) {
      var r = regras[campo.id](v);
      if (r !== true) msg = r;
    }
    mostrarErro(campo, msg);
    return !msg;
  }

  form.querySelectorAll(".campo input, .campo select").forEach(function (campo) {
    campo.addEventListener("blur", function () { validarCampo(campo); });
    campo.addEventListener("input", function () {
      if (campo.closest(".campo").classList.contains("invalido")) validarCampo(campo);
    });
  });

  // ---------- "Não possuo" empresa/CNPJ ----------
  $("sem-empresa").addEventListener("change", function (e) {
    ["empresa", "cnpj"].forEach(function (id) {
      var campo = $(id);
      campo.value = e.target.checked ? NAO_POSSUO : "";
      campo.readOnly = e.target.checked;
      campo.closest(".campo").classList.toggle("bloqueado", e.target.checked);
      mostrarErro(campo, "");
    });
  });

  // ---------- CEP → endereço (ViaCEP) ----------
  $("cep").addEventListener("input", function (e) {
    var cep = soDigitos(e.target.value);
    var ajuda = $("cep-ajuda");
    if (cep.length !== 8) return;
    ajuda.textContent = "Buscando endereço…";
    fetch("https://viacep.com.br/ws/" + cep + "/json/")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.erro) { ajuda.textContent = "CEP não encontrado. Preencha o endereço manualmente."; return; }
        if (d.logradouro && !$("endereco").value) $("endereco").value = d.logradouro;
        if (d.bairro && !$("bairro").value) $("bairro").value = d.bairro;
        if (d.localidade) $("cidade").value = d.localidade;
        if (d.uf) $("estado").value = d.uf;
        ["endereco", "cidade"].forEach(function (id) { mostrarErro($(id), ""); });
        ajuda.textContent = "Endereço preenchido. Confira e informe o número.";
        $("numero").focus();
      })
      .catch(function () { ajuda.textContent = "Não foi possível buscar o CEP. Preencha manualmente."; });
  });

  // ---------- Envio ----------
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var erroGeral = $("erro-geral");
    erroGeral.hidden = true;

    var ok = true;
    var primeiro = null;
    form.querySelectorAll(".campo input, .campo select").forEach(function (campo) {
      if (!validarCampo(campo)) { ok = false; primeiro = primeiro || campo; }
    });
    var radio = form.querySelector('input[name="treinamento"]:checked');
    var bonus = form.querySelector(".bonus");
    bonus.classList.toggle("invalido", !radio);
    if (!radio) { ok = false; primeiro = primeiro || form.querySelector('input[name="treinamento"]'); }

    if (!ok) {
      erroGeral.textContent = "Confira os campos destacados.";
      erroGeral.hidden = false;
      primeiro.focus();
      return;
    }

    var valores = {};
    Object.keys(cfg.entries).forEach(function (campo) {
      valores[campo] = campo === "treinamento" ? radio.value : ($(campo) ? $(campo).value.trim() : "");
    });

    var botao = $("enviar");
    botao.disabled = true;
    botao.querySelector("span").textContent = "ENVIANDO…";

    // Google Forms e Apps Script não devolvem CORS: com no-cors a resposta é
    // opaca, então só uma falha de rede chega ao catch.
    var post = function (url, params) {
      return fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
    };
    var envios = [];
    if (cfg.sheetsUrl) {
      var planilha = new URLSearchParams(valores);
      UTMS.forEach(function (k) { planilha.append(k, origem[k]); });
      planilha.append("pagina", location.href.split("?")[0]);
      envios.push(post(cfg.sheetsUrl, planilha));
    }
    if (cfg.enviarParaForms !== false) {
      var forms = new URLSearchParams();
      Object.keys(cfg.entries).forEach(function (campo) {
        if (valores[campo]) forms.append(cfg.entries[campo], valores[campo]);
      });
      envios.push(post(cfg.formAction, forms));
    }

    Promise.all(envios)
      .then(function () {
        window.asbTrack("Lead", { content_name: "Inscrição Amazônia Solar Business 2026" });
        window.asbTrack("CompleteRegistration", { content_name: "Amazônia Solar Business 2026", status: true });
        form.hidden = true;
        var ok = $("sucesso");
        ok.hidden = false;
        ok.focus();
        ok.scrollIntoView({ behavior: "smooth", block: "start" });
      })
      .catch(function () {
        botao.disabled = false;
        botao.querySelector("span").textContent = "GARANTIR MINHA VAGA";
        erroGeral.textContent = "Não foi possível enviar agora. Verifique sua conexão e tente de novo.";
        erroGeral.hidden = false;
      });
  });
})();
