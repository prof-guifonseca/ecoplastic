# EcoPlastic

> MVP offline de Recycle-as-a-Service para condominios: compactador inteligente de PET, app do morador, painel do sindico, coletas, financeiro, recompensas e relatorio ESG.

**Nota de marca:** o repositorio se chama `ecotech` por historico, mas o produto e a marca atuais sao **EcoPlastic**. A chave legada `ecotech:v1` e migrada automaticamente para `ecoplastic:v2`.

## Stack

- Next 16 + React 19 + TypeScript
- App Router com `output: "export"` para deploy estatico
- Turbopack via `next dev` / `next build`
- Persistencia local versionada: `ecoplastic:v2`
- Migracao automatica da chave legada: `ecotech:v1`
- Chart.js, QRCode, jsPDF, Three.js e lucide-react via npm

## Rodando

```bash
npm install
npm run dev
```

Abra <http://localhost:3000>.

## Rotas principais

| Rota | Funcao |
| --- | --- |
| `/` | Entrada do produto |
| `/equipamento/` | Compactador 3D e proposta tecnica |
| `/prototipo-3d/` | Prototipo 3D completo (Three.js standalone): prensa, tanque, portinhola, vista explodida, raio-X e BOM |
| `/app/login/` | Escolha de persona |
| `/app/login/?p=sindico` | Entrada rapida no painel do sindico |
| `/app/login/?p=morador` | Entrada rapida no app do morador |
| `/app/sindico/dashboard/` | KPIs, ranking, capacidade e grafico |
| `/app/sindico/coletas/` | Solicitar, reagendar e cancelar coletas |
| `/app/sindico/financeiro/` | Saldo, reparticao e simulador |
| `/app/sindico/moradores/` | Convites e ranking |
| `/app/sindico/esg/` | PDF ESG e compartilhamento |
| `/app/sindico/config/` | Cooperativa, backup/importacao e reset |
| `/app/morador/inicio/` | Saldo, ranking e atividade recente |
| `/app/morador/historico/` | Depositos e resgates |
| `/app/morador/trocar/` | Recompensas |
| `/app/morador/qr/` | QR real e simulacao de deposito |

## Compatibilidade

- `/prototipo/?p=sindico` e `/prototipo/?p=morador` redirecionam para o login novo.
- `/ecotech.html` redireciona para `/equipamento/` no Netlify e tambem existe como fallback estatico em `public/`.
- O prototipo 3D original (Three.js standalone) foi preservado em `public/prototipo-3d/` e publicado em `/prototipo-3d/`, com link na pagina `/equipamento/`.
- Dados antigos em `localStorage` com `ecotech:v1` sao migrados para `ecoplastic:v2`.

## Verificacao

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run e2e
```

## Deploy Netlify

O `netlify.toml` roda `npm run build` e publica `out/`.

```bash
netlify deploy --prod
```

## Sem banco de dados

O MVP nao usa backend, API routes, Server Actions, cookies de autenticacao ou banco. O estado fica no navegador, com exportacao/importacao JSON para backup e continuidade de demonstracoes.
