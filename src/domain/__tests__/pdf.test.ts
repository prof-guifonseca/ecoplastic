import { describe, expect, it } from 'vitest';
import { buildSeed } from '../seed';
import { buildEsgDoc } from '../pdf';

const T = 1_800_000_000_000;

describe('pdf ESG', () => {
  it('gera um documento nao-vazio sem lancar', () => {
    const doc = buildEsgDoc(buildSeed(T));
    const bytes = doc.output('arraybuffer') as ArrayBuffer;
    expect(bytes.byteLength).toBeGreaterThan(1000);
  });
});
