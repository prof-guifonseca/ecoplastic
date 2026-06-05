import { BRAND } from './brand';
import type { EcoPlasticState } from './types';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

function hasCoreShape(value: unknown): value is UnknownRecord {
  if (!isRecord(value)) return false;
  return Array.isArray(value.moradores)
    && Array.isArray(value.coletas)
    && Array.isArray(value.transacoes)
    && Array.isArray(value.recompensas)
    && isRecord(value.condominio)
    && isRecord(value.maquina)
    && isRecord(value.cooperativa)
    && isRecord(value.configPontos);
}

export function validateState(value: unknown): EcoPlasticState | null {
  if (!hasCoreShape(value)) return null;
  const state = value as Partial<EcoPlasticState>;
  if (state.schemaVersion !== BRAND.schemaVersion) return null;
  if (typeof state.condominio?.nome !== 'string') return null;
  if (!Array.isArray(state.cooperativa?.lista)) return null;
  if (typeof state.maquina?.capacidadeKg !== 'number') return null;
  return state as EcoPlasticState;
}

export function normalizeImportedState(value: unknown): EcoPlasticState | null {
  if (isRecord(value) && value.app === BRAND.name) {
    const state = validateState(value.state);
    if (state) return state;
  }
  return validateState(value);
}
