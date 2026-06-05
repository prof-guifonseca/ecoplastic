import { describe, expect, it } from 'vitest';
import { buildSeed } from '../seed';
import { cancelarColeta, convidarMoradores, depositarPET, resgatarRecompensa, solicitarColeta, trocarCooperativa } from '../actions';
import { inputDate } from '../format';

const T = 1_800_000_000_000;

describe('actions (reducers puros e imutaveis)', () => {
  it('depositarPET credita pontos e nao muta o estado original', () => {
    const state = buildSeed(T);
    const morador = state.moradores[0];
    const beforePontos = morador.pontos;
    const beforeOcupado = state.maquina.ocupadoKg;
    const { state: next, transacao } = depositarPET(state, { moradorId: morador.id, kg: 1 });

    expect(transacao.pontos).toBe(30);
    expect(next.moradores[0].pontos).toBe(beforePontos + 30);
    expect(next.maquina.ocupadoKg).toBeGreaterThan(beforeOcupado);
    // imutabilidade do estado de entrada
    expect(state.moradores[0].pontos).toBe(beforePontos);
    expect(state.maquina.ocupadoKg).toBe(beforeOcupado);
  });

  it('depositarPET rejeita peso fora da faixa de demonstracao', () => {
    const state = buildSeed(T);
    const id = state.moradores[0].id;
    expect(() => depositarPET(state, { moradorId: id, kg: 0 })).toThrow();
    expect(() => depositarPET(state, { moradorId: id, kg: 6 })).toThrow();
  });

  it('resgatarRecompensa debita pontos e estoque; rejeita saldo insuficiente', () => {
    const state = buildSeed(T);
    const morador = state.moradores.find((m) => m.pontos >= 2000)!;
    const recompensa = state.recompensas[0];
    const { state: next } = resgatarRecompensa(state, { moradorId: morador.id, recompensaId: recompensa.id });
    expect(next.moradores.find((m) => m.id === morador.id)!.pontos).toBe(morador.pontos - recompensa.custoPontos);
    expect(next.recompensas[0].estoque).toBe(recompensa.estoque - 1);

    const pobre = state.moradores.find((m) => m.pontos < recompensa.custoPontos)!;
    expect(() => resgatarRecompensa(state, { moradorId: pobre.id, recompensaId: recompensa.id })).toThrow();
  });

  it('solicitarColeta exige data futura', () => {
    const state = buildSeed(T);
    const ontem = inputDate(new Date(Date.now() - 2 * 86_400_000));
    expect(() => solicitarColeta(state, { data: ontem })).toThrow();
    const amanha = inputDate(new Date(Date.now() + 2 * 86_400_000));
    expect(solicitarColeta(state, { data: amanha }).coleta.status).toBe('pendente');
  });

  it('convidarMoradores valida email/apto e duplicidade', () => {
    const state = buildSeed(T);
    expect(() => convidarMoradores(state, [])).toThrow();
    expect(() => convidarMoradores(state, [{ email: 'invalido', apto: '9001' }])).toThrow();
    const aptoExistente = state.moradores[0].apto;
    expect(() => convidarMoradores(state, [{ email: 'novo@x.com', apto: aptoExistente }])).toThrow();
    const ok = convidarMoradores(state, [{ email: 'novo@x.com', apto: '9999' }]);
    expect(ok.convites).toHaveLength(1);
  });

  it('trocarCooperativa muda a ativa e rejeita id desconhecido', () => {
    const state = buildSeed(T);
    const outra = state.cooperativa.lista[1].id;
    expect(trocarCooperativa(state, outra).cooperativa.atualId).toBe(outra);
    expect(() => trocarCooperativa(state, 'nao_existe')).toThrow();
  });

  it('cancelarColeta nao cancela coleta concluida', () => {
    const state = buildSeed(T);
    const concluida = state.coletas.find((c) => c.status === 'concluida')!;
    expect(() => cancelarColeta(state, concluida.id)).toThrow();
  });
});
