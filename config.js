// Configurações da página de inscrição — edite só este arquivo.
window.ASB_CONFIG = {
  // ID do Pixel da Meta (Gerenciador de Eventos → Fontes de dados → seu Pixel).
  // Enquanto estiver "SEU_PIXEL_ID", o Pixel não é carregado.
  pixelId: "2321127448666972",

  // Link do App da Web do Apps Script que grava na planilha
  // "Inscrições · Amazônia Solar Business 2026" (termina em /exec). Vazio = não envia para a planilha.
  sheetsUrl:
    "https://script.google.com/macros/s/AKfycbzLcnGCjLOUvvUqz55gBLU701OHlsjXLL4vQZ__y5IcimceFJ9Q_AKU3EC_WSLO1HHSxA/exec",

  // Também enviar para o Google Forms original? (true = sim)
  enviarParaForms: false,

  // Endereço de envio do Google Forms original.
  formAction:
    "https://docs.google.com/forms/d/e/1FAIpQLSfSptltBUsNNCKEy9XuuhV9g5k9r0H3V_uyvS_A2stM310ESA/formResponse",

  // Campo da página → ID do campo no Google Forms.
  entries: {
    nome: "entry.1290919540",
    cpf: "entry.666095704",
    email: "entry.197805721",
    whatsapp: "entry.1779809910",
    empresa: "entry.100012093",
    cnpj: "entry.875358321",
    endereco: "entry.660151454",
    numero: "entry.165009560",
    cep: "entry.579001531",
    cidade: "entry.14612290",
    estado: "entry.1973843969",
    bairro: "entry.680297696",
    treinamento: "entry.1766688284",
  },
};
