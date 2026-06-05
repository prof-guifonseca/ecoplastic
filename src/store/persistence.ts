'use client';

import { BRAND } from '@/domain/brand';
import { migrateLegacyState, normalizeImportedState, validateState } from '@/domain/migration';
import type { EcoPlasticState, ImportEnvelope } from '@/domain/types';

export interface LoadResult {
  state: EcoPlasticState | null;
  migrated: boolean;
  error?: string;
}

function parseJson(raw: string | null) {
  if (!raw) return null;
  return JSON.parse(raw) as unknown;
}

export function loadPersistedState(): LoadResult {
  try {
    const current = validateState(parseJson(localStorage.getItem(BRAND.storageKey)));
    if (current) return { state: current, migrated: false };

    const legacy = migrateLegacyState(parseJson(localStorage.getItem(BRAND.legacyStorageKey)));
    if (legacy) {
      saveState(legacy);
      return { state: legacy, migrated: true };
    }
    return { state: null, migrated: false };
  } catch (error) {
    return { state: null, migrated: false, error: error instanceof Error ? error.message : 'Falha ao ler dados locais' };
  }
}

export function saveState(state: EcoPlasticState) {
  try {
    localStorage.setItem(BRAND.storageKey, JSON.stringify(state));
  } catch (error) {
    console.error('[EcoPlastic] persist failed', error);
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
