# Inscrição · Amazônia Solar Business 2026

Página de inscrição com a identidade visual do evento. As respostas são enviadas para o **mesmo Google Forms** de antes, então continuam caindo na mesma planilha de respostas.

## Para onde vão as inscrições

1. **Planilha Google** "Inscrições · Amazônia Solar Business 2026" (conta jpmirand3@gmail.com):
   https://docs.google.com/spreadsheets/d/1JZa4mGPdjvBmzH9CB0zHGR89N03wJEV2Rta0AG3-g-E/edit
   Cada inscrição vira uma linha, com data/hora e a origem da visita (`utm_source`, `utm_campaign`…).
   Quem grava é o Apps Script "Receptor inscrições ASB 2026" (código em `apps-script/Codigo.gs`), publicado como App da Web; o link `/exec` dele está em `config.js` → `sheetsUrl`.
2. **Google Forms original:** desligado (`enviarParaForms: false` em `config.js`). Troque para `true` se quiser voltar a enviar para lá também.

Para mudar o script: edite no Apps Script, salve e use **Implantar → Gerenciar implantações → editar (lápis) → Versão: Nova versão → Implantar**. Assim o link `/exec` continua o mesmo.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | A página |
| `styles.css` | Visual (cores, fontes, layout) |
| `script.js` | Máscaras, validação, busca de CEP e envio para o Google Forms |
| `config.js` | **Único arquivo que você precisa editar**: ID do Pixel e IDs dos campos do Forms |
| `pixel.js` | Carrega o Pixel da Meta (só se houver um ID em `config.js`) |
| `assets/` | Logos e foto |

## 1. Colocar o Pixel da Meta

1. No Gerenciador de Eventos da Meta, copie o ID do seu Pixel (um número de 15–16 dígitos).
2. Abra `config.js` e troque `"SEU_PIXEL_ID"` pelo número, por exemplo `pixelId: "123456789012345"`.

Eventos enviados:
- `PageView`: quando a página abre.
- `Lead` e `CompleteRegistration`: quando a inscrição é enviada.

Nenhum dado pessoal (nome, CPF, e-mail) é mandado para a Meta.

## 2. Publicar no GitHub Pages

1. Crie um repositório no GitHub (por exemplo `inscricao-asb-2026`).
2. Envie todos os arquivos desta pasta para a raiz do repositório (botão **Add file → Upload files**).
3. Vá em **Settings → Pages**, em *Source* escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salve.
4. Em 1–2 minutos a página fica no ar em `https://SEU-USUARIO.github.io/inscricao-asb-2026/`.

## 3. Teste antes de divulgar

Faça uma inscrição de teste pela página publicada e confira se ela aparece nas respostas do Google Forms. Depois, apague essa resposta de teste no Forms.

## Se mudar o Google Forms

Se você adicionar, remover ou recriar perguntas no Forms, os IDs (`entry.xxxx`) mudam. Nesse caso é preciso atualizar `config.js` (e o campo correspondente no `index.html`).
