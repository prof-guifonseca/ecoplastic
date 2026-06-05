import { BRAND } from './brand';
import { ecoPlasticStateSchema, importEnvelopeSchema } from './schema';
import type { EcoPlasticState } from './types';

type UnknownRecord = Record<string, unknown>;

// Escada de migracao por versao de schema. Vazia hoje (so existe a v2), mas e o
// ponto onde futuras migracoes ordenadas (v2 -> v3) entram, de forma testavel.
const migrations: Record<number, (state: UnknownRecord) => UnknownRecord> = {};

function migrate(raw: unknown): unknown {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return raw;
  let current = raw as UnknownRecord;
  while (
    typeof current.schemaVersion === 'number' &&
    current.schemaVersion < BRAND.schemaVersion &&
    migrations[current.schemaVersion]
  ) {
    current = migrations[current.schemaVersion](current);
  }
  return current;
}

/** Valida (e aplica migracoes) de um estado desconhecido. Retorna null se invalido. */
export function validateState(value: unknown): EcoPlasticState | null {
  const result = ecoPlasticStateSchema.safeParse(migrate(value));
  return result.success ? (result.data as EcoPlasticState) : null;
}

/** Aceita tanto um envelope de export ({ app, exportedAt, state }) quanto um estado cru. */
export function normalizeImportedState(value: unknown): EcoPlasticState | null {
  const envelope = importEnvelopeSchema.safeParse(value);
  if (envelope.success) return envelope.data.state as EcoPlasticState;
  return validateState(value);
}
