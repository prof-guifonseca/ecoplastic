# ADR 0004 — Testes e2e contra o build estático

## Contexto
Os testes Playwright apontavam para `next dev`, que no Next 16 (lock de dev único + compilação sob demanda) gera instabilidade de corrida na primeira navegação. Além disso, o artefato que vai à feira é o build estático, não o servidor de desenvolvimento.

## Decisão
Executar os testes e2e contra o **build estático servido** (`serve out/`), e não contra `next dev`. O `webServer` do Playwright passa a servir `out/`.

## Consequências
- (+) Elimina a flakiness de compilação; testa exatamente os bytes publicados.
- (+) Habilita testes de offline (o Service Worker só registra em produção/estático).
- (−) e2e passa a depender de `npm run build` antes de rodar (sequência build → e2e, no CI e localmente).
