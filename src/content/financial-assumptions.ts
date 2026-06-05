// Premissas do modelo financeiro do EcoPlastic (demonstrativas).
//
// Os numeros abaixo sustentam o simulador e os KPIs de receita. Sao premissas e
// faixas de mercado, NAO valores auditados. A reparticao 70/30 e uma HIPOTESE de
// modelo de negocio do projeto, nao um fato cientifico.
//
// Derivacao e fontes em docs/metodologia-financeira.md.

export interface FinancialAssumption {
  label: string;
  value: number;
  unit: string;
  source: string;
  sourceUrl: string;
  note: string;
}

/** PET coletado por morador ativo a cada mes. */
export const KG_POR_MORADOR_MES: FinancialAssumption = {
  label: 'PET por morador ativo / mes',
  value: 5.8,
  unit: 'kg',
  source: 'Estimativa a partir do consumo per capita de PET no Brasil, ajustada por participacao.',
  sourceUrl: 'https://cempre.org.br/indice-de-reciclaveis/',
  note: 'Faixa demonstrativa de 4 a 8 kg/morador.mes; valor central 5,8 kg.'
};

/** Preco de venda do PET as cooperativas (faixa regional brasileira). */
export const PRECO_KG = {
  label: 'Preco de venda do PET a cooperativa',
  unit: 'R$/kg',
  min: 2.32,
  mid: 2.45,
  max: 2.55,
  source: 'CEMPRE, Indice de Reciclaveis; Recicla Sampa (faixas regionais BR).',
  sourceUrl: 'https://cempre.org.br/indice-de-reciclaveis/',
  note: 'Precos regionais demonstrativos, dentro da faixa praticada no Brasil (~R$ 1,50 a 4,00/kg).'
} as const;

/** Reparticao da receita entre condominio e EcoPlastic. HIPOTESE de negocio. */
export const SPLIT_CONDOMINIO: FinancialAssumption = {
  label: 'Reparticao da receita (condominio / EcoPlastic)',
  value: 0.7,
  unit: 'fracao',
  source: 'Hipotese de modelo de negocio do projeto.',
  sourceUrl: '',
  note: '70% para o condominio, 30% para a EcoPlastic (operacao da maquina, plataforma, integracao com cooperativa). Hipotese sujeita a validacao em piloto.'
};

/** Aviso de transparencia exibido proximo aos numeros financeiros. */
export const FINANCEIRO_DISCLAIMER =
  'Valores financeiros sao demonstrativos, baseados em premissas e faixas de mercado. A reparticao 70/30 e uma hipotese de modelo de negocio. Ver docs/metodologia-financeira.md.';
