import { BRAND, LEGACY_BRAND_NAME } from './brand';
import { buildSeed } from './seed';
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

function replaceBrand(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.replaceAll(LEGACY_BRAND_NAME, BRAND.name).replaceAll('ecotech://', BRAND.qrScheme);
  }
  if (Array.isArray(value)) return value.map(replaceBrand);
  if (isRecord(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceBrand(item)]));
  }
  return value;
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

export function migrateLegacyState(value: unknown): EcoPlasticState | null {
  if (!hasCoreShape(value)) return null;
  const migrated = replaceBrand(value) as UnknownRecord;
  const seeded = buildSeed();
  return {
    ...seeded,
    ...migrated,
    schemaVersion: BRAND.schemaVersion,
    persona: (migrated.persona === 'sindico' || migrated.persona === 'morador') ? migrated.persona : null,
    currentMoradorId: typeof migrated.currentMoradorId === 'string' ? migrated.currentMoradorId : null,
    auditLog: [
      {
        id: `audit_${Date.now().toString(36)}`,
        ts: Date.now(),
        actor: 'migracao',
        action: 'storage.migrated',
        summary: `Dados locais migrados de ${BRAND.legacyStorageKey} para ${BRAND.storageKey}`
      },
      ...(Array.isArray(migrated.auditLog) ? migrated.auditLog : [])
    ].slice(0, 80)
  } as EcoPlasticState;
}

export function normalizeImportedState(value: unknown): EcoPlasticState | null {
  if (isRecord(value) && value.app === BRAND.name) {
    const state = validateState(value.state);
    if (state) return state;
  }
  const valid = validateState(value);
  if (valid) return valid;
  return migrateLegacyState(value);
}
