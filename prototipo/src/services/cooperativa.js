import { getState, update } from '../core/store.js';

export function listar() { return getState().cooperativa.lista; }
export function atual() {
  const s = getState();
  return s.cooperativa.lista.find(c => c.id === s.cooperativa.atualId);
}
export function trocar(coopId) {
  update(s => { s.cooperativa.atualId = coopId; });
}
