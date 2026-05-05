import { getState, update } from '../core/store.js';
import { uid } from '../core/id.js';
import { emit } from '../core/bus.js';
import { parseLocalDate } from '../core/format.js';

export function listarColetas() {
  return [...getState().coletas].sort((a, b) => b.data - a.data);
}

export function proximaAgendada() {
  return getState().coletas
    .filter(c => c.status === 'agendada' && c.data >= Date.now() - 86400000)
    .sort((a, b) => a.data - b.data)[0];
}

export function solicitarAvulsa({ data, observacao }) {
  const coopId = getState().cooperativa.atualId;
  const c = {
    id: uid('c'),
    data: parseLocalDate(data).getTime(),
    status: 'pendente',
    pesoKg: 0,
    valorBruto: 0,
    cooperativaId: coopId,
    observacao
  };
  update(s => { s.coletas.push(c); });
  emit('coleta:created', c);
  return c;
}

export function reagendar(coletaId, novaData) {
  update(s => {
    const c = s.coletas.find(x => x.id === coletaId);
    if (c) c.data = parseLocalDate(novaData).getTime();
  });
}

export function cancelar(coletaId) {
  update(s => {
    const c = s.coletas.find(x => x.id === coletaId);
    if (c) c.status = 'cancelada';
  });
}

export function totaisMensais() {
  // Returns last 6 months [{ label, kg, receita }]
  const map = new Map();
  const hoje = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const k = `${d.getFullYear()}-${d.getMonth()}`;
    map.set(k, { label: d, kg: 0, receita: 0 });
  }
  getState().coletas.forEach(c => {
    if (c.status !== 'concluida') return;
    const d = new Date(c.data);
    const k = `${d.getFullYear()}-${d.getMonth()}`;
    if (map.has(k)) {
      const e = map.get(k);
      e.kg += c.pesoKg;
      e.receita += c.valorBruto;
    }
  });
  return Array.from(map.values());
}

export function totalKgMes(mesOffset = 0) {
  const hoje = new Date();
  const target = new Date(hoje.getFullYear(), hoje.getMonth() - mesOffset, 1);
  return getState().coletas
    .filter(c => {
      const d = new Date(c.data);
      return c.status === 'concluida' && d.getMonth() === target.getMonth() && d.getFullYear() === target.getFullYear();
    })
    .reduce((s, c) => s + c.pesoKg, 0);
}

export function receitaMes(mesOffset = 0) {
  const hoje = new Date();
  const target = new Date(hoje.getFullYear(), hoje.getMonth() - mesOffset, 1);
  return getState().coletas
    .filter(c => {
      const d = new Date(c.data);
      return c.status === 'concluida' && d.getMonth() === target.getMonth() && d.getFullYear() === target.getFullYear();
    })
    .reduce((s, c) => s + c.valorBruto, 0);
}
