# Metodologia do modelo financeiro — EcoPlastic

> Nota de transparência: os valores financeiros do EcoPlastic são **demonstrativos**, baseados em premissas e faixas de mercado. A repartição **70/30** é uma **hipótese de modelo de negócio** do projeto, não um fato científico. Este documento registra as premissas usadas pelo simulador e pelos KPIs de receita.

## 1. Premissas

As premissas estão centralizadas em `src/content/financial-assumptions.ts` e consumidas por `simulateFinanceiro()` em `src/domain/selectors.ts`.

| Premissa | Valor adotado | Faixa | Fonte |
|---|---|---|---|
| PET por morador ativo/mês | **5,8 kg** | 4–8 kg | Consumo per capita de PET (BR) ajustado por participação |
| Preço de venda à cooperativa | **R$ 2,45/kg** (central) | R$ 2,32–2,55 (regional); ~R$ 1,50–4,00 no Brasil | CEMPRE — Índice de Recicláveis; Recicla Sampa |
| Repartição condomínio / EcoPlastic | **70% / 30%** | hipótese | Modelo de negócio do projeto |

### 1.1 Justificativas

- **5,8 kg/morador·mês.** Estimativa a partir do consumo per capita de embalagens PET no Brasil, ajustada para a fração de moradores efetivamente engajados. Apresentada como **faixa (4–8 kg)** com valor central, e não como constante única.
- **R$ 2,45/kg.** Os preços por cooperativa no seed (R$ 2,32 a 2,55) estão **dentro da faixa real** praticada no Brasil. O valor central de R$ 2,45/kg é usado apenas como *fallback* quando nenhuma cooperativa está selecionada.
- **Repartição 70/30.** É uma **hipótese de negócio**: 70% da venda do PET ficam com o condomínio e 30% com a EcoPlastic, que cobre operação da máquina, plataforma e integração com a cooperativa. Está explicitamente rotulada como hipótese na interface (tela Financeiro) e está sujeita a validação em piloto.

## 2. Cálculo do simulador

```
ativos        = unidades × (engajamento% / 100)
kg/mês        = ativos × 5,8 kg
receita bruta = kg/mês × preço R$/kg (da cooperativa ativa)
receita cond. = receita bruta × 0,70
receita anual = receita cond. × 12
```

## 3. Limitações

- Não modela inadimplência, sazonalidade, custos logísticos variáveis nem impostos.
- Os volumes e preços são **demonstrativos**; um piloto real exigiria pesagem e contratos com cooperativas.
- A repartição é uma proposta; a divisão efetiva depende de negociação caso a caso.

## 4. Referências

- COMPROMISSO EMPRESARIAL PARA RECICLAGEM (CEMPRE). *Índice de Recicláveis.* Disponível em: https://cempre.org.br/indice-de-reciclaveis/. Acesso em: 5 jun. 2026.
- RECICLA SAMPA. *Conheça a taxa brasileira de reciclagem dos principais materiais.* Disponível em: https://www.reciclasampa.com.br/artigo/conheca-a-taxa-brasileira-de-reciclagem-dos-principais-materiais. Acesso em: 5 jun. 2026.
- BRASIL. *Lei nº 12.305, de 2 de agosto de 2010. Política Nacional de Resíduos Sólidos.* Brasília: Presidência da República, 2010.
