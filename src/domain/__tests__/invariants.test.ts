import { describe, expect, it } from 'vitest';
import { configPontos, cooperativas } from '../../content/scenarios/jardim-palmeiras';
import { PRECO_KG, SPLIT_CONDOMINIO } from '../../content/financial-assumptions';

// Travas contra deriva entre camadas independentes (cenario vs premissas
// documentadas). Mantem os numeros da demo coerentes com a metodologia.
describe('invariantes de constantes', () => {
  it('split do cenario coincide com a premissa documentada', () => {
    expect(configPontos.splitCondominio).toBe(SPLIT_CONDOMINIO.value);
  });

  it('precos das cooperativas ficam dentro da faixa documentada', () => {
    for (const coop of cooperativas) {
      expect(coop.precoKg).toBeGreaterThanOrEqual(PRECO_KG.min);
      expect(coop.precoKg).toBeLessThanOrEqual(PRECO_KG.max);
    }
  });
});
