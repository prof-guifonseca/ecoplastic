# ADR 0005 — Validação de dados com zod na fronteira

## Contexto
O estado vive no cliente ([ADR 0002](0002-estado-context-localstorage.md)) e entra por canais não confiáveis: `localStorage`, import de arquivo JSON e sincronização entre abas. Um payload corrompido ou adulterado não pode quebrar a demonstração nem ser aceito cegamente.

## Decisão
Validar todo dado de entrada contra **schemas zod** (`src/domain/schema.ts`), que espelham `src/domain/types.ts`. `validateState`/`normalizeImportedState` (`src/domain/migration.ts`) usam `safeParse`; em caso de falha, degradam para o seed determinístico. Há uma **escada de migração** por `schemaVersion` (vazia hoje, pronta para v2→v3) e o caminho de sincronização entre abas passa a validar (sem `JSON.parse` cru).

## Consequências
- (+) Entrada não confiável é barrada na fronteira; corrupção/adulteração degrada com segurança.
- (+) Uma única fonte de verdade de formato (schema), testável (`src/domain/__tests__/migration.test.ts`).
- (+) Caminho explícito e ordenado para futuras migrações de schema.
- (−) Acrescenta a dependência `zod` (~pequena, tree-shakeable) e um passo de parse no load/import (custo desprezível nesta escala).
