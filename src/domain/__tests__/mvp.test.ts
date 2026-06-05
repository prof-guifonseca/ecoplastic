import { describe, expect, it } from 'vitest';
import { BRAND } from '../brand';
import { depositarPET, resgatarRecompensa, solicitarColeta } from '../actions';
import { validateState } from '../migration';
import { buildQrPayload } from '../qr';
import { buildSeed } from '../seed';
import { metricasEsg, saldoCondominio, simulateFinanceiro } from '../selectors';

describe('EcoPlastic domain', () => {
  it('builds deterministic seed data for demos', () => {
    const a = buildSeed(1_800_000_000_000);
    const b = buildSeed(1_800_000_000_000);

    expect(a.moradores[0]).toEqual(b.moradores[0]);
    expect(a.coletas.map((coleta) => coleta.valorBruto)).toEqual(b.coletas.map((coleta) => coleta.valorBruto));
    expect(a.schemaVersion).toBe(BRAND.schemaVersion);
  });

  it('registers a PET deposit and propagates points, kg and machine capacity', () => {
    const state = buildSeed(1_800_000_000_000);
    const morador = state.moradores[0];
    const before = morador.pontos;
    const result = depositarPET(state, { moradorId: morador.id, kg: 0.4 });
    const updated = result.state.moradores.find((item) => item.id === morador.id);

    expect(result.transacao.pontos).toBe(12);
    expect(updated?.pontos).toBe(before + 12);
    expect(result.state.maquina.ocupadoKg).toBeGreaterThan(state.maquina.ocupadoKg);
    expect(result.state.auditLog[0].action).toBe('deposito.created');
  });

  it('redeems rewards with inventory and point debits', () => {
    const state = buildSeed(1_800_000_000_000);
    const morador = state.moradores.find((item) => item.pontos >= 2000);
    expect(morador).toBeDefined();
    const recompensa = state.recompensas[0];
    const result = resgatarRecompensa(state, { moradorId: morador!.id, recompensaId: recompensa.id });
    const updated = result.state.moradores.find((item) => item.id === morador!.id);
    const updatedReward = result.state.recompensas.find((item) => item.id === recompensa.id);

    expect(result.transacao.pontos).toBe(-recompensa.custoPontos);
    expect(updated?.pontos).toBe(morador!.pontos - recompensa.custoPontos);
    expect(updatedReward?.estoque).toBe(recompensa.estoque - 1);
  });

  it('calculates finance and ESG metrics from completed pickups', () => {
    const state = buildSeed(1_800_000_000_000);
    const saldo = saldoCondominio(state);
    const sim = simulateFinanceiro(state, 84, 74);
    const esg = metricasEsg(state);

    expect(saldo).toBeGreaterThan(0);
    expect(sim.receitaAnual).toBeGreaterThan(sim.receitaMensal);
    expect(esg.garrafas).toBe(Math.round(esg.kg * 30));
  });

  it('validates current state and rejects incompatible schema versions', () => {
    expect(validateState(buildSeed(1_800_000_000_000))).not.toBeNull();

    const wrongVersion = buildSeed(1_800_000_000_000) as unknown as Record<string, unknown>;
    wrongVersion.schemaVersion = 1;
    expect(validateState(wrongVersion)).toBeNull();

    expect(validateState({ foo: 'bar' })).toBeNull();
  });

  it('creates collection requests and QR payloads with the EcoPlastic scheme', () => {
    const state = buildSeed(1_800_000_000_000);
    const future = new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10);
    const requested = solicitarColeta(state, { data: future, observacao: 'Portaria 2' });
    const payload = buildQrPayload(state.moradores[0].id);

    expect(requested.coleta.status).toBe('pendente');
    expect(requested.coleta.observacao).toBe('Portaria 2');
    expect(payload.startsWith(BRAND.qrScheme)).toBe(true);
    expect(payload).toContain('morador=');
  });
});
