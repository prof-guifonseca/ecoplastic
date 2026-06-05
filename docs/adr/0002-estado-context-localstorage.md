# ADR 0002 — Estado no cliente: React Context + localStorage

## Contexto
Sem backend ([ADR 0001](0001-export-estatico-sem-backend.md)), o estado da aplicação (condomínio, moradores, coletas, transações, recompensas) precisa de um lar no cliente, com persistência entre sessões e continuidade da demonstração.

## Decisão
Centralizar o estado em um React Context (`src/store/ecoplastic-store.tsx`), com mutações por reducers puros e imutáveis (`structuredClone`) em `src/domain/actions.ts`, e persistência em localStorage (`ecoplastic:v2`) com validação/migração (`src/domain/migration.ts`) e exportação/importação JSON para backup.

## Consequências
- (+) Lógica de domínio pura e altamente testável, desacoplada da UI.
- (+) `structuredClone` garante imutabilidade simples e correta na escala do protótipo.
- (+) Backup e continuidade por JSON, sem servidor.
- (−) Sem sincronização entre dispositivos.
- (−) `structuredClone` por ação tem custo; aceitável dado o volume (dezenas de moradores, ações disparadas por clique). Reavaliar (memoização ou loja dedicada) apenas se o profiling indicar necessidade.
