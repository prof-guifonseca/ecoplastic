# EcoPlastic

> Recycle-as-a-Service para condomínios — compactador inteligente de PET + plataforma SaaS com gestão, gamificação e relatório ESG.

## Estrutura

| Arquivo / pasta | O que é |
| --- | --- |
| `index.html` | Entrada do site: hero medalhão + 2 CTAs primários (Síndico · Morador) + link "Conheça o equipamento" |
| `ecoplastic.html` | Conheça o equipamento: pitch, BOM e render 3D do compactador |
| `prototipo/` | App navegável (SPA vanilla com `localStorage`, Chart.js, QR code real, PDF do ESG via jsPDF). Aceita `?p=sindico` / `?p=morador` para auto-login |

## Rodando localmente

```bash
# Qualquer servidor estático servindo a raiz funciona:
npx serve .
# ou
python -m http.server 8080
```

Abra `http://localhost:5173` (ou a porta usada).

## Deploy no Netlify

A raiz já tem `netlify.toml`. Basta:

```bash
# Drag-and-drop do ZIP na UI do Netlify, ou:
netlify deploy --prod --dir=.
```

## Protótipo — fluxos demonstráveis

1. Login → Síndico → Dashboard com KPIs reais e gráfico Chart.js
2. **Coletas**: solicitar avulsa, reagendar, cancelar
3. **Financeiro**: simulador com sliders, share via Web Share API
4. **Moradores**: convidar (modal repetível com validação), ranking top 20
5. **ESG**: download do PDF (jsPDF), share por WhatsApp / e-mail / Instagram
6. **Configurações**: trocar cooperativa, resetar dados de demonstração
7. **Morador**: QR rotativo (60 s), simular depósito → propaga para o painel do síndico em tempo real
8. **Trocar pontos**: 6 recompensas, debita pontos e atualiza saldo em 3 lugares (UI, sidebar, localStorage)

## Stack

- HTML5 / CSS3 / JS modular (ES Modules) — sem build, sem npm install
- Chart.js, qrcode.js (davidshimjs) e jsPDF via CDN
- Persistência: `localStorage` versionado (`eco:v1`)

## Licença

Uso acadêmico — Engenharia de Software.
