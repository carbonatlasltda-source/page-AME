// Receptor das inscrições do site → planilha "Inscrições · Amazônia Solar Business 2026".
// Implantado como App da Web (Executar como: eu · Quem pode acessar: qualquer pessoa).

const PLANILHA_ID = "1JZa4mGPdjvBmzH9CB0zHGR89N03wJEV2Rta0AG3-g-E";
const ABA = "Inscrições";

// Ordem das colunas: [chave enviada pelo site, título da coluna]
const CAMPOS = [
  ["nome", "Nome completo"],
  ["cpf", "CPF"],
  ["email", "E-mail"],
  ["whatsapp", "WhatsApp"],
  ["empresa", "Empresa ou instituição"],
  ["cnpj", "CNPJ"],
  ["cep", "CEP"],
  ["endereco", "Endereço"],
  ["numero", "Número"],
  ["bairro", "Bairro"],
  ["cidade", "Cidade"],
  ["estado", "Estado"],
  ["treinamento", "Concorrer ao treinamento (Bárbara Rubim)"],
  ["utm_source", "utm_source"],
  ["utm_medium", "utm_medium"],
  ["utm_campaign", "utm_campaign"],
  ["utm_content", "utm_content"],
  ["pagina", "Página de origem"],
];

function aba_() {
  const ss = SpreadsheetApp.openById(PLANILHA_ID);
  return ss.getSheetByName(ABA) || ss.getSheets()[0];
}

// Rode uma vez pelo editor: nomeia a planilha e monta o cabeçalho.
function configurar() {
  const ss = SpreadsheetApp.openById(PLANILHA_ID);
  ss.rename("Inscrições · Amazônia Solar Business 2026");
  const sh = ss.getSheets()[0];
  sh.setName(ABA);
  const titulos = ["Data/hora"].concat(CAMPOS.map((c) => c[1]));
  sh.clear();
  sh.getRange(1, 1, 1, titulos.length)
    .setValues([titulos])
    .setFontWeight("bold")
    .setFontColor("#ffffff")
    .setBackground("#0b3d1f")
    .setVerticalAlignment("middle");
  sh.setRowHeight(1, 36);
  sh.setFrozenRows(1);
  sh.setColumnWidth(1, 150);
  sh.setColumnWidths(2, titulos.length - 1, 190);
  sh.getRange("A:A").setNumberFormat("dd/MM/yyyy HH:mm:ss");
  // CPF, WhatsApp, CEP, CNPJ e Número como texto (mantém zeros e máscaras)
  ["C", "E", "G", "H", "J"].forEach((col) => sh.getRange(col + ":" + col).setNumberFormat("@"));
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const p = (e && e.parameter) || {};
    const linha = [new Date()].concat(CAMPOS.map((c) => String(p[c[0]] || "").slice(0, 500)));
    aba_().appendRow(linha);
    return resposta_({ ok: true });
  } catch (err) {
    return resposta_({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return resposta_({ ok: true, servico: "inscricoes-asb-2026" });
}

function resposta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
