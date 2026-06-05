# Metodologia dos indicadores ambientais (ESG) — EcoPlastic

> Nota de transparência: os indicadores ambientais do EcoPlastic são **estimativas**, obtidas pela aplicação de **fatores de conversão da literatura** sobre os **dados de demonstração** do protótipo. Não constituem medição auditada nem resultado de campo. Este documento registra cada fator, sua faixa na literatura, a fonte, o escopo e a incerteza, para que a banca possa avaliar a coerência metodológica.

## 1. Objetivo

Tornar rastreável e defensável cada número ambiental exibido na plataforma (tela de Relatório ESG e PDF). Cada fator deixou de ser um literal "mágico" no código e passou a ser uma **constante tipada e documentada** em `src/content/esg-factors.ts`, com `fonte`, `escopo` e `premissa`.

## 2. Fatores adotados

Todos os fatores são aplicados ao total de **kg de PET reciclado** (somatório das coletas concluídas).

| Indicador | Fator adotado | Faixa na literatura | Escopo | Fonte |
|---|---|---|---|---|
| Garrafas PET fora do aterro | **40 garrafas/kg** | ~25–50 garrafas/kg (depende da gramatura) | Ciclo de vida | Premissa de 25 g por garrafa de 500 ml |
| CO₂ equivalente evitado | **0,0015 t CO₂e/kg** (1,5 kg/kg) | ~1,1–1,8 kg CO₂e/kg | Ciclo de vida (rPET vs virgem) | APR LCA (2020); ACS Sust. Chem. Eng. (2018) |
| Energia poupada | **5,4 kWh/kg** | ~5,4–7,2 kWh/kg | Ciclo de vida (rPET vs virgem) | ACS (2018); MDPI Recycling (2025) |
| Água economizada | **2 L/kg** | ~2–4 L/kg (somente produção) | Produção | Delta de produção (ACV) |

### 2.1 Premissas e justificativas

- **Garrafas/kg (40).** Uma garrafa PET de 500 ml pesa em média ~25 g; logo 1 kg ≈ 40 garrafas. O valor anterior (30/kg) assumia implicitamente ~33 g/garrafa sem declarar a premissa. O que torna o indicador defensável é **declarar a massa assumida**.
- **CO₂ (0,0015 t/kg).** Estudos de ACV indicam que o rPET evita da ordem de **1,5 kg CO₂e por kg** frente ao PET virgem. O valor anterior (0,0027 t/kg ≈ 2,7 kg/kg) estava cerca de 1,8× acima da faixa típica e foi corrigido para o limite conservador.
- **Energia (5,4 kWh/kg).** A literatura aponta economias de até ~7,2 kWh/kg. Mantivemos **5,4 kWh/kg** como valor conservador e citado — a postura cautelosa é preferível em avaliação científica.
- **Água (2 L/kg).** O ganho de água atribuível à **produção** (ACV) é da ordem de **2 L/kg**. O valor anterior (10 L/kg) não se sustentava no escopo de produção e foi reduzido, com o escopo agora explícito ("produção", sem incluir lavagem/uso doméstico).

## 3. Indicador removido: "árvores equivalentes"

O indicador anterior `árvores preservadas = kg × 0,045` foi **removido**. Não existe um fator científico consolidado que mapeie quilogramas de PET reciclado em "árvores preservadas": a reciclagem de PET não substitui diretamente extração de madeira, e o número transmitia uma equivalência sem base.

A árvore permanece no produto **apenas como recompensa real** (resgate "Adoção de 1 árvore — SOS Mata Atlântica"), que é uma ação concreta, e não como métrica ambiental fabricada. Registrar essa autocrítica é parte do rigor metodológico.

## 4. Limitações

- Os fatores são médias da literatura internacional; a realidade brasileira pode variar conforme matriz energética, logística e tecnologia da cooperativa.
- Os volumes de PET são **dados de demonstração** determinísticos, não medições de um condomínio real.
- O cálculo agrega coletas concluídas; não modela perdas de processo, rejeitos ou contaminação.

## 5. Reprodutibilidade

Os fatores estão centralizados em `src/content/esg-factors.ts` e consumidos por `metricasEsg()` em `src/domain/selectors.ts`. O seed é determinístico (`buildSeed(timestamp)`), de modo que os indicadores são **reproduzíveis**: a mesma entrada gera sempre os mesmos números, o que é verificado por teste automatizado (`src/domain/__tests__/mvp.test.ts`).

## 6. Referências

- ASSOCIATION OF PLASTIC RECYCLERS (APR). *Life Cycle Impacts for Postconsumer Recycled Resins: PET, HDPE, and PP.* 2020. Disponível em: https://plasticsrecycling.org/wp-content/uploads/2024/08/APR-Recycled-vs-Virgin-LCA-May2020.pdf. Acesso em: 5 jun. 2026.
- ACS SUSTAINABLE CHEMISTRY & ENGINEERING. *Energy and Environmental Benefits of Virgin, Recycled and Bio-Derived PET.* 2018. Disponível em: https://pubs.acs.org/doi/10.1021/acssuschemeng.8b00750. Acesso em: 5 jun. 2026.
- MDPI RECYCLING. *Life Cycle Assessment of PET Recycling.* 2025. Disponível em: https://www.mdpi.com/2313-4321/10/3/98. Acesso em: 5 jun. 2026.
- ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. *ABNT NBR 10004: Resíduos sólidos — classificação.* Rio de Janeiro: ABNT, 2004.
- BRASIL. *Lei nº 12.305, de 2 de agosto de 2010. Política Nacional de Resíduos Sólidos.* Brasília: Presidência da República, 2010.
