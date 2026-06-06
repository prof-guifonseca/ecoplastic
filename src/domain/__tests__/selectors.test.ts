import { describe, expect, it } from 'vitest';
import { buildSeed } from '../seed';
import {
  cooperativaAtual,
  listarColetas,
  metricasEsg,
  moradorAtual,
  pontosDistribuidosMes,
  posicaoDe,
  proximaAgendada,
  ranking,
  saldoCondominio,
  simulateFinanceiro,
  totaisMensais,
  totalAtivosMes,
  totalCadastrados,
  transacoesDoMorador
} from '../selectors';
import { convidarMoradores, depositarPET, setPersona } from '../actions';
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

describe('selectors complementares', () => {
  it('cooperativaAtual retorna a coop ativa e null para id desconhecido', () => {
    const state = buildSeed(T);
    expect(cooperativaAtual(state)?.id).toBe(state.cooperativa.atualId);
    const semCoop = { ...state, cooperativa: { ...state.cooperativa, atualId: 'nao_existe' } };
    expect(cooperativaAtual(semCoop)).toBeNull();
  });

  it('listarColetas ordena por data desc sem perder itens', () => {
    const state = buildSeed(T);
    const lista = listarColetas(state);
    expect(lista).toHaveLength(state.coletas.length);
    for (let i = 1; i < lista.length; i += 1) {
      expect(lista[i - 1].data).toBeGreaterThanOrEqual(lista[i].data);
    }
  });

  it('proximaAgendada retorna agendada futura mais proxima ou null', () => {
    const state = buildSeed(T);
    const prox = proximaAgendada(state);
    if (prox) {
      expect(prox.status).toBe('agendada');
      expect(prox.data).toBeGreaterThanOrEqual(Date.now() - 86_400_000);
    }
    const semAgendadas = { ...state, coletas: state.coletas.filter((c) => c.status !== 'agendada') };
    expect(proximaAgendada(semAgendadas)).toBeNull();
  });

  it('transacoesDoMorador filtra por morador e ordena por ts desc', () => {
    const state = buildSeed(T);
    const todas = transacoesDoMorador(state);
    expect(todas).toHaveLength(state.transacoes.length);
    for (let i = 1; i < todas.length; i += 1) {
      expect(todas[i - 1].ts).toBeGreaterThanOrEqual(todas[i].ts);
    }
    const alvo = state.transacoes[0].moradorId;
    const doMorador = transacoesDoMorador(state, alvo);
    expect(doMorador.length).toBeGreaterThan(0);
    expect(doMorador.every((t) => t.moradorId === alvo)).toBe(true);
  });

  it('totalCadastrados soma moradores e convites pendentes', () => {
    const state = buildSeed(T);
    const base = state.moradores.length + state.convites.filter((c) => c.status === 'pendente').length;
    expect(totalCadastrados(state)).toBe(base);
    const { state: comConvite } = convidarMoradores(state, [{ email: 'novo@x.com', apto: '9999' }]);
    expect(totalCadastrados(comConvite)).toBe(base + 1);
  });

  it('totalAtivosMes nao diminui ao registrar um novo deposito', () => {
    const state = buildSeed(T);
    const antes = totalAtivosMes(state);
    const { state: next } = depositarPET(state, { moradorId: state.moradores[0].id, kg: 1 });
    expect(totalAtivosMes(next)).toBeGreaterThanOrEqual(antes);
    expect(totalAtivosMes(next)).toBeGreaterThanOrEqual(1);
  });

  it('pontosDistribuidosMes cresce exatamente pelos pontos do novo deposito', () => {
    const state = buildSeed(T);
    const antes = pontosDistribuidosMes(state);
    const { state: next, transacao } = depositarPET(state, { moradorId: state.moradores[0].id, kg: 1 });
    expect(pontosDistribuidosMes(next) - antes).toBe(transacao.pontos);
  });

  it('totaisMensais retorna 6 meses com valores nao-negativos', () => {
    const meses = totaisMensais(buildSeed(T));
    expect(meses).toHaveLength(6);
    for (const mes of meses) {
      expect(mes.label instanceof Date).toBe(true);
      expect(mes.kg).toBeGreaterThanOrEqual(0);
      expect(mes.receita).toBeGreaterThanOrEqual(0);
    }
  });

  it('moradorAtual resolve o morador logado ou null', () => {
    const state = buildSeed(T);
    expect(moradorAtual(setPersona(state, 'sindico'))).toBeNull();
    const alvo = state.moradores[0];
    expect(moradorAtual(setPersona(state, 'morador', alvo.id))?.id).toBe(alvo.id);
  });
});
