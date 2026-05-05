import { getState, update } from '../core/store.js';
import { uid } from '../core/id.js';
import { emit } from '../core/bus.js';

export function listar(moradorId) {
  const all = getState().transacoes;
  return (moradorId ? all.filter(t => t.moradorId === moradorId) : all)
    .slice().sort((a, b) => b.ts - a.ts);
}

export function depositoPlastico({ moradorId, kg }) {
  const cfg = getState().configPontos;
  const pontos = Math.round(kg * cfg.pontosPorKg);
  const t = { id: uid('t'), tipo: 'deposito', moradorId, kg, pontos, ts: Date.now() };
  update(s => {
    s.transacoes.unshift(t);
    const m = s.moradores.find(x => x.id === moradorId);
    if (m) {
      m.pontos += pontos;
      m.kgTotal = +(m.kgTotal + kg).toFixed(2);
      m.ativo = true;
    }
    s.maquina.ocupadoKg = +(s.maquina.ocupadoKg + kg).toFixed(2);
    if (s.maquina.ocupadoKg > s.maquina.capacidadeKg) s.maquina.ocupadoKg = s.maquina.capacidadeKg;
  });
  emit('deposito:registrado', t);
  return t;
}

export function resgateRecompensa({ moradorId, recompensaId }) {
  const s = getState();
  const m = s.moradores.find(x => x.id === moradorId);
  const r = s.recompensas.find(x => x.id === recompensaId);
  if (!m || !r) throw new Error('Inválido');
  if (m.pontos < r.custoPontos) throw new Error('Pontos insuficientes');
  if (r.estoque <= 0) throw new Error('Sem estoque');
  const t = {
    id: uid('t'),
    tipo: 'resgate',
    moradorId,
    recompensaId,
    pontos: -r.custoPontos,
    valor: 0,
    ts: Date.now()
  };
  update(state => {
    state.transacoes.unshift(t);
    const mm = state.moradores.find(x => x.id === moradorId);
    mm.pontos -= r.custoPontos;
    const rr = state.recompensas.find(x => x.id === recompensaId);
    rr.estoque -= 1;
  });
  return t;
}

export function pontosDistribuidosMes() {
  const inicio = new Date();
  inicio.setDate(1);
  inicio.setHours(0, 0, 0, 0);
  return getState().transacoes
    .filter(t => t.ts >= inicio.getTime() && t.pontos > 0)
    .reduce((s, t) => s + t.pontos, 0);
}
