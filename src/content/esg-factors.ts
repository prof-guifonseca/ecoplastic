// Fatores de conversao ambiental do EcoPlastic.
//
// Cada fator e aplicado a 1 kg de PET reciclado e carrega a fonte, o escopo e a
// premissa explicita. Os valores sao conservadores e baseados em literatura de
// Analise de Ciclo de Vida (ACV/LCA) de PET reciclado (rPET) vs PET virgem.
//
// IMPORTANTE: sao estimativas aplicadas a DADOS DE DEMONSTRACAO, nao medicao
// auditada. A discussao completa (faixas, incertezas, e a remocao do indicador
// "arvores equivalentes") esta em docs/metodologia-esg.md.

export type EsgScope = 'producao' | 'ciclo-de-vida';

export interface EsgFactor {
  /** identificador estavel do fator */
  id: 'garrafas' | 'co2' | 'energia' | 'agua';
  /** rotulo curto em pt-BR para a UI */
  label: string;
  /** unidade do resultado (apos multiplicar por kg) */
  unit: string;
  /** valor por kg de PET reciclado */
  perKg: number;
  /** escopo da estimativa */
  scope: EsgScope;
  /** referencia curta (estilo ABNT) */
  source: string;
  /** URL da fonte */
  sourceUrl: string;
  /** premissa explicita assumida */
  note: string;
}

export const ESG_FACTORS = {
  garrafas: {
    id: 'garrafas',
    label: 'Garrafas PET fora do aterro',
    unit: 'garrafas',
    perKg: 40,
    scope: 'ciclo-de-vida',
    source: 'Premissa de massa media por garrafa (25 g / 500 ml).',
    sourceUrl: 'https://www.chinaplasticsbottles.com/info/how-much-does-a-500ml-pet-bottle-weigh-103157934.html',
    note: 'Assume 25 g por garrafa PET de 500 ml, logo 1 kg ~= 40 garrafas. Garrafas maiores reduzem a contagem.'
  },
  co2: {
    id: 'co2',
    label: 'CO2 equivalente evitado',
    unit: 't CO2e',
    perKg: 0.0015,
    scope: 'ciclo-de-vida',
    source: 'APR, Recycled vs. Virgin Plastic LCA (2020); ACS Sustainable Chem. & Eng. (2018).',
    sourceUrl: 'https://plasticsrecycling.org/wp-content/uploads/2024/08/APR-Recycled-vs-Virgin-LCA-May2020.pdf',
    note: 'rPET evita ~1,5 kg CO2e por kg frente ao PET virgem (0,0015 t/kg). Valor conservador da faixa de literatura.'
  },
  energia: {
    id: 'energia',
    label: 'Energia poupada',
    unit: 'kWh',
    perKg: 5.4,
    scope: 'ciclo-de-vida',
    source: 'ACS Sustainable Chem. & Eng. (2018); MDPI Recycling (2025).',
    sourceUrl: 'https://pubs.acs.org/doi/10.1021/acssuschemeng.8b00750',
    note: 'Estimativa conservadora de ~5,4 kWh poupados por kg de rPET vs virgem (literatura aponta ate ~7,2 kWh/kg).'
  },
  agua: {
    id: 'agua',
    label: 'Agua economizada (producao)',
    unit: 'L',
    perKg: 2,
    scope: 'producao',
    source: 'Delta de producao (ACV) rPET vs virgem.',
    sourceUrl: 'https://www.mdpi.com/2313-4321/10/3/98',
    note: 'Escopo restrito a producao: ~2 L economizados por kg. Nao inclui agua de lavagem/uso domestico.'
  }
} satisfies Record<string, EsgFactor>;

export type EsgFactorId = keyof typeof ESG_FACTORS;

/** Aviso de transparencia exibido proximo aos indicadores ESG. */
export const ESG_DISCLAIMER =
  'Indicadores ambientais sao estimativas: fatores de conversao da literatura aplicados a dados de demonstracao. Nao constituem medicao auditada. Ver docs/metodologia-esg.md.';

/** Resumo das fontes para citacao compacta na UI e no PDF. */
export const ESG_SOURCES_SHORT = 'APR (2020); ACS (2018); MDPI (2025); garrafas a 25 g.';
