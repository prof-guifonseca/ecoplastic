import { describe, expect, it } from 'vitest';
import { buildSeed } from '../seed';
import { metricasEsg, posicaoDe, ranking, saldoCondominio, simulateFinanceiro } from '../selectors';
import { ESG_FACTORS } from '../../content/esg-factors';

const T = 1_800_000_000_000;

describe('selectors', () => {
  it('ranking ordena por pontos desc e Julia lidera', () => {
    const state = buildSeed(T);
    const top = ranking(state, 5);
    expect(top[0].nome).toContain('Julia');
    for (let i = 1; i < top.length; i += 1) {
      expect(top[i - 1].pontos).toBeGreaterThanOrEqual(top[i].pontos);
    }
    expect(posicaoDe(state, top[0].id)).toBe(1);
  });

  it('metricasEsg deriva dos fatores e nao expoe arvores', () => {
    const esg = metricasEsg(buildSeed(T));
    expect(esg.garrafas).toBe(Math.round(esg.kg * ESG_FACTORS.garrafas.perKg));
    expect(esg).not.toHaveProperty('arvores');
  });

  it('saldoCondominio = soma das coletas concluidas * split', () => {
    const state = buildSeed(T);
    const esperado = state.coletas
      .filter((c) => c.status === 'concluida')
      .reduce((s, c) => s + c.valorBruto * state.configPontos.splitCondominio, 0);
    expect(saldoCondominio(state)).toBeCloseTo(esperado, 2);
    expect(saldoCondominio(state)).toBeGreaterThan(0);
  });

  it('simulateFinanceiro escala com engajamento', () => {
    const state = buildSeed(T);
    const baixo = simulateFinanceiro(state, 100, 30);
    const alto = simulateFinanceiro(state, 100, 80);
    expect(alto.receitaAnual).toBeGreaterThan(baixo.receitaAnual);
    expect(alto.receitaAnual).toBeCloseTo(alto.receitaMensal * 12, 2);
  });
});
