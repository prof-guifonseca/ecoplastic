import { getState, update } from '../core/store.js';
import { uid } from '../core/id.js';

export function listar() { return getState().moradores; }
export function getById(id) { return getState().moradores.find(m => m.id === id); }
export function getByApto(apto) { return getState().moradores.find(m => m.apto === apto); }

export function ranking(limit = 10) {
  return [...getState().moradores]
    .filter(m => m.ativo)
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, limit);
}

export function posicaoDe(moradorId) {
  const r = [...getState().moradores].filter(m => m.ativo).sort((a, b) => b.pontos - a.pontos);
  return r.findIndex(m => m.id === moradorId) + 1;
}

export function convidar(rows) {
  const novos = rows.map(r => ({
    id: uid('cv'),
    email: r.email,
    apto: r.apto,
    status: 'pendente',
    criadoEm: Date.now()
  }));
  update(s => { s.convites.push(...novos); });
  return novos;
}

export function convitesPendentes() {
  return getState().convites.filter(c => c.status === 'pendente');
}

export function totalCadastrados() {
  return getState().moradores.length + convitesPendentes().length;
}

export function totalAtivosMes() {
  const inicio = new Date();
  inicio.setDate(1);
  inicio.setHours(0, 0, 0, 0);
  const ativos = new Set();
  getState().transacoes.forEach(t => {
    if (t.tipo === 'deposito' && t.ts >= inicio.getTime()) ativos.add(t.moradorId);
  });
  return ativos.size;
}
