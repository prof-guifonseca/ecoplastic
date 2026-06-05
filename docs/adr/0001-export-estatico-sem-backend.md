# ADR 0001 — Export estático, sem backend/banco

## Contexto
O EcoPlastic é demonstrado em feira científica, possivelmente em notebook sem internet. O público é uma banca avaliadora; não há, nesta fase, usuários reais nem necessidade de persistência centralizada.

## Decisão
Adotar Next.js com `output: 'export'` (site 100% estático), sem backend, API routes, server actions ou banco de dados. Hospedagem em CDN estática (Netlify).

## Consequências
- (+) Roda offline em qualquer servidor estático; portabilidade total para a feira.
- (+) Custo de hospedagem próximo de zero; superfície de ataque mínima.
- (+) Sem operação de servidor/banco para manter.
- (−) Sem persistência multiusuário; o estado é por dispositivo (ver [ADR 0002](0002-estado-context-localstorage.md)).
- (−) Recursos que exigem servidor (e-mail real, OG dinâmica) ficam fora de escopo ou são simulados e claramente rotulados.
