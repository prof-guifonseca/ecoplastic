# ADR 0003 — Dados de demonstração determinísticos

## Contexto
Os indicadores (ESG, financeiro, ranking) precisam ser reproduzíveis e cientificamente honestos. A banca valoriza método e reprodutibilidade; números "mágicos" e dados aleatórios não verificáveis enfraquecem a credibilidade.

## Decisão
Gerar os dados de demonstração de forma **determinística** via `buildSeed(timestamp)`. Centralizar fatores de conversão e premissas em `src/content/` (com fonte, escopo e nota), documentados em `docs/metodologia-esg.md` e `docs/metodologia-financeira.md`. Cobrir a reprodutibilidade e a fiação dos fatores com testes (`src/domain/__tests__/mvp.test.ts`).

## Consequências
- (+) Mesma entrada produz os mesmos números; resultados verificáveis e citáveis.
- (+) Indicadores deixam de ser literais soltos e passam a ter proveniência.
- (+) O indicador sem base ("árvores equivalentes") foi removido; a árvore permanece apenas como recompensa real (SOS Mata Atlântica).
- (−) Os dados continuam sintéticos (não medidos em campo); são rotulados como "dados demonstrativos" na UI.
- (Nota) O PRNG atual (sine-hash em `seed.ts`) será substituído por um PRNG semeado (mulberry32) em fase posterior, mantendo o determinismo.
