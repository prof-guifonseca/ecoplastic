import { describe, expect, it } from 'vitest';
import { buildSeed } from '../seed';
import { normalizeImportedState, validateState } from '../migration';
import { BRAND } from '../brand';

const T = 1_800_000_000_000;

describe('migration / validacao (zod)', () => {
  it('aceita estado valido', () => {
    expect(validateState(buildSeed(T))).not.toBeNull();
  });

  it('rejeita versao de schema incompativel e lixo', () => {
    const wrong = buildSeed(T) as unknown as Record<string, unknown>;
    wrong.schemaVersion = 1;
    expect(validateState(wrong)).toBeNull();
    expect(validateState({ foo: 'bar' })).toBeNull();
    expect(validateState(null)).toBeNull();
  });

  it('rejeita estado com campo de tipo errado', () => {
    const bad = buildSeed(T) as unknown as Record<string, unknown>;
    (bad.maquina as Record<string, unknown>).capacidadeKg = 'muito';
    expect(validateState(bad)).toBeNull();
  });

  it('normalizeImportedState aceita envelope e estado cru, rejeita app errado', () => {
    const envelope = { app: BRAND.name, exportedAt: new Date().toISOString(), state: buildSeed(T) };
    expect(normalizeImportedState(envelope)).not.toBeNull();
    expect(normalizeImportedState(buildSeed(T))).not.toBeNull();
    expect(normalizeImportedState({ app: 'Outro', state: {} })).toBeNull();
  });
});
