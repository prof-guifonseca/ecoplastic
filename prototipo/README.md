# EcoPlastic — Protótipo Funcional

Protótipo navegável da plataforma **EcoPlastic** (Recycle-as-a-Service para condomínios). SPA vanilla com estado persistido, fluxos completos, gráficos Chart.js, QR Code real e PDF do ESG via jsPDF.

## Como abrir

ES Modules exigem servir via HTTP (não funciona em `file://` na maioria dos navegadores). Opções:

```bash
# 1. Python (qualquer versão moderna)
python -m http.server 8080

# 2. Node (sem instalar nada via npx)
npx serve .

# 3. VS Code: extensão "Live Server" → clique direito no index.html → Open with Live Server
```

Depois abra <http://localhost:8080> (ou a porta sugerida).

## O que tem

### Login
- Escolha de persona: **Síndico Marcos** (painel web) ou **Morador Julia** (app no celular). Dropdown para entrar como qualquer outro morador.

### Painel do síndico (`#/admin/...`)
- **Dashboard** — KPIs reais (kg, receita, ativos, CO₂), gráfico Chart.js dos últimos 6 meses, antes×depois, capacidade da máquina, top 3 ranking.
- **Coletas** — solicitar coleta avulsa, reagendar e cancelar. Tabela com status (Pago, Agendada, Pendente, Cancelada).
- **Financeiro** — saldo, acumulado, projeção, repartição 70/30 com donut, simulador de receita (sliders) e botão de compartilhar.
- **Moradores** — KPIs de adesão, ranking top 20, **convidar** (modal repetível com validação de e-mail e apto).
- **Relatório ESG** — métricas ambientais, **download PDF real** (jsPDF), compartilhamento no WhatsApp/E-mail/Instagram/clipboard com Web Share API + fallback.
- **Configurações** — programa de pontos, **trocar cooperativa parceira** (preço por kg muda nas próximas coletas), trocar perfil, **resetar dados de demonstração**.

### App do morador (`#/morador/...`)
- **Início** — saldo em pontos + equivalência em R$, atividade recente, posição no ranking.
- **Histórico** — log agrupado por dia com depósitos e resgates.
- **Trocar** — 6 recompensas (boleto, árvore, sacola, cinema, iFood). Botão "Trocar" desabilitado se faltar saldo ou estoque, com tooltip explicativo.
- **QR** — QR code gerado de verdade (qrcode.js) com renovação a cada 60s e barra de countdown. Botão **"Simular depósito"** dispara o fluxo de leitura da máquina: adiciona 0,4 kg, credita pontos, atualiza máquina, ranking, dashboard do síndico, histórico do morador.

## Tecnologia

- HTML5 / CSS3 / JavaScript modular (ES Modules)
- Sem build, sem npm install
- CDN: [Chart.js](https://www.chartjs.org/), [qrcode.js](https://github.com/soldair/node-qrcode), [jsPDF](https://github.com/parallax/jsPDF)
- Estado em `localStorage` (chave `ecotech:v1`, schema versionado)

## Estrutura

```
prototipo/
├── index.html
├── assets/styles/    (tokens, shell, components, screens)
└── src/
    ├── main.js
    ├── core/         (store, router, bus, format, validate, id)
    ├── data/         (schema, seed)
    ├── services/     (coletas, moradores, transacoes, financeiro, esg, cooperativa, qr)
    ├── components/   (modal, toast, form, chart, skeleton)
    └── views/
        ├── login.js
        ├── admin/    (shell, dashboard, coletas, financeiro, moradores, esg, config)
        └── morador/  (phone, standalone, inicio, historico, trocar, qr)
```

## Fluxos demonstráveis

1. Solicitar coleta avulsa → aparece como pendente.
2. Reagendar a próxima coleta agendada.
3. Convidar 2 moradores → contador "cadastrados" sobe.
4. Baixar o PDF do relatório ESG (com tabela mensal e equivalências).
5. Compartilhar via WhatsApp, e-mail, Instagram (clipboard) ou copiar link.
6. Trocar cooperativa → preço/kg muda.
7. Trocar de perfil para Morador Julia.
8. Na aba QR, clicar **"Simular depósito"** várias vezes — observe o saldo subir, o histórico crescer e (ao voltar para Síndico) o dashboard refletir a mudança.
9. Resgatar uma recompensa (saldo descontado, transação no histórico).
10. Em Configurações, **Resetar dados** volta tudo ao seed inicial.

## Reset manual

DevTools → Application → Local Storage → apagar `ecotech:v1` → recarregar.

## Fora de escopo (intencional)

- Backend, autenticação real, pagamentos, PDF assinado, validação real do QR, PWA/offline, testes automatizados, responsividade mobile do dashboard admin (mantém layout desktop).
