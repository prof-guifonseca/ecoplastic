# EcoPlastic — guia do repositorio (CLAUDE.md)

EcoPlastic e um prototipo de Recycle-as-a-Service para condominios (compactador inteligente de PET + plataforma web), desenvolvido como projeto de pesquisa para a feira cientifica FECCI 2026. Este arquivo orienta contribuintes humanos e agentes.

## Restricoes invioláveis
- **Export estatico** (`next.config.ts` -> `output: 'export'`). Sem SSR, sem API routes, sem server actions, sem middleware.
- **Sem banco de dados / sem backend.** Todo o estado vive no navegador (React Context + localStorage, chave `ecoplastic:v2`, `schemaVersion: 2`).
- **Offline-capable.** A demonstracao precisa rodar em notebook sem internet (contingencia da feira). Nada essencial pode depender de rede.
- Nao usar `next/og` em runtime (incompativel com export). Imagens OG, se houver, devem ser estaticas.

## Arquitetura
- `src/domain/` — logica pura, sem React: `types.ts`, `actions.ts` (reducers imutaveis via `structuredClone`), `selectors.ts` (derivacoes, ESG, financeiro), `seed.ts` (dados de demonstracao deterministicos), `format.ts`, `pdf.ts`, `qr.ts`, `brand.ts`, `migration.ts`.
- `src/content/` — dados/parametros com proveniencia: `esg-factors.ts`, `financial-assumptions.ts` (fatores com fonte/escopo/nota). Consumidos pelos selectors.
- `src/store/` — `ecoplastic-store.tsx` (Context provider) + `persistence.ts` (localStorage).
- `src/features/` — telas por persona: `admin/*` (sindico) e `morador/*`.
- `src/components/` — UI: `ui/` (primitivos, shells, toast, source-note), `charts/`, `equipment/` (Three.js), `qr/`, `pwa/`.
- `src/app/` — App Router (paginas finas que montam as telas de `features`).

## Dados e metodologia
- Indicadores ESG e financeiros sao **estimativas sobre dados de demonstracao**, com fatores documentados em `docs/metodologia-esg.md` e `docs/metodologia-financeira.md`. A UI rotula isso como "Dados demonstrativos".
- O seed e **deterministico**: `buildSeed(timestamp)` produz sempre o mesmo estado (garantido por teste).
- Estado da maquina (`ocupadoKg`/`ultimaColeta`) e derivado das coletas/transacoes, nao hardcoded.

## Comandos
```bash
npm run dev         # desenvolvimento
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run test        # vitest (dominio)
npm run build       # export estatico para out/
npm run e2e         # playwright
```
Verificacao recomendada antes de commitar: `npm run typecheck && npm run lint && npm run test && npm run build`.

## Convencoes
- TypeScript strict. Imports com alias `@/*` -> `src/*` (UI) ou relativos dentro do dominio.
- Strings de codigo em ASCII (sem acentos), seguindo o padrao existente; documentos `.md` usam portugues acentuado.
- Decisoes arquiteturais relevantes ficam em `docs/adr/`.
- Roadmap de evolucao: ver o plano em `.claude/plans/` e os ADRs.
