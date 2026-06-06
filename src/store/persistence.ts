'use client';

import { BRAND } from '@/domain/brand';
import { normalizeImportedState, validateState } from '@/domain/migration';
import type { EcoPlasticState, ImportEnvelope } from '@/domain/types';

export interface LoadResult {
  state: EcoPlasticState | null;
  error?: string;
}

export interface SaveResult {
  ok: boolean;
  error?: string;
}

function parseJson(raw: string | null) {
  if (!raw) return null;
  return JSON.parse(raw) as unknown;
}

export function loadPersistedState(): LoadResult {
  try {
    const current = validateState(parseJson(localStorage.getItem(BRAND.storageKey)));
    if (current) return { state: current };
    return { state: null };
  } catch (error) {
    return { state: null, error: error instanceof Error ? error.message : 'Falha ao ler dados locais' };
  }
}

export function saveState(state: EcoPlasticState): SaveResult {
  try {
    localStorage.setItem(BRAND.storageKey, JSON.stringify(state));
    return { ok: true };
  } catch (error) {
    console.error('[EcoPlastic] persist failed', error);
    return { ok: false, error: error instanceof Error ? error.message : 'falha desconhecida' };
  }
}

export function clearState() {
  try {
    localStorage.removeItem(BRAND.storageKey);
  } catch {}
}

export function makeExportEnvelope(state: EcoPlasticState): ImportEnvelope {
  return {
    app: BRAND.name,
    exportedAt: new Date().toISOString(),
    state
  };
}

export function stateFromImport(raw: string) {
  return normalizeImportedState(JSON.parse(raw));
}
