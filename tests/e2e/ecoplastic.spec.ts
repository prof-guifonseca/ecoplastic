import { expect, test } from '@playwright/test';

test('quick sindico login opens dashboard and navigates to ESG', async ({ page }) => {
  await page.goto('/app/login/?p=sindico');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByText('Receita do condominio')).toBeVisible();
  await page.getByRole('link', { name: 'Abrir relatorio' }).click();
  await expect(page.getByRole('heading', { name: 'Relatorio ESG', exact: true })).toBeVisible();
});

test('resident QR deposit updates points and history', async ({ page }) => {
  await page.goto('/app/login/?p=morador');
  await expect(page.getByRole('heading', { name: /Bom dia|Boa tarde|Boa noite/ })).toBeVisible();
  const before = await page.locator('.p-balance .pts').first().textContent();

  await page.getByRole('link', { name: /QR/ }).click();
  await expect(page.getByText('ecoplastic://')).toBeVisible();
  await page.getByRole('button', { name: /Simular deposito/ }).click();
  await expect(page.getByText('Deposito registrado')).toBeVisible();

  await page.getByRole('link', { name: /Inicio/ }).click();
  const after = await page.locator('.p-balance .pts').first().textContent();
  expect(after).not.toBe(before);

  await page.getByRole('link', { name: /Historico/ }).click();
  await expect(page.getByText('0.4 kg PET').first()).toBeVisible();
});

test('legacy prototype URL bridges to the new app', async ({ page }) => {
  await page.goto('/prototipo/?p=sindico');
  await expect(page).toHaveURL(/\/app\/sindico\/dashboard\//);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('legacy localStorage is migrated to ecoplastic:v2', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('ecotech:v1', JSON.stringify({
      schemaVersion: 1,
      persona: null,
      currentMoradorId: null,
      condominio: { id: 'cond_legacy', nome: 'Predio Legado', unidades: 10, endereco: 'Rua Antiga, 1' },
      maquina: { id: 'maq_old', capacidadeKg: 100, ocupadoKg: 20, ultimaColeta: Date.now() },
      cooperativa: { atualId: 'coop_old', lista: [{ id: 'coop_old', nome: 'Coop Legada', precoKg: 2.1, distanciaKm: 2 }] },
      configPontos: { pontosPorKg: 30, pontosPorGarrafa: 10, valorReaisPorPonto: 0.005, splitCondominio: 0.7 },
      moradores: [{ id: 'm_old', nome: 'Morador EcoTech', apto: '101', email: 'old@example.com', pontos: 2100, kgTotal: 12, ativo: true, criadoEm: Date.now() }],
      convites: [],
      coletas: [{ id: 'c_old', data: Date.now(), status: 'concluida', pesoKg: 50, valorBruto: 105, cooperativaId: 'coop_old' }],
      transacoes: [],
      recompensas: [{ id: 'r_old', titulo: 'Sacola eco EcoTech', descricao: 'Legacy', ico: '♻', custoPontos: 100, parceiro: 'EcoTech', estoque: 1 }]
    }));
  });

  await page.goto('/app/login/');
  await expect(page.getByText('Predio Legado')).toBeVisible();
  const migrated = await page.evaluate(() => localStorage.getItem('ecoplastic:v2'));
  expect(migrated).toContain('EcoPlastic');
  expect(migrated).not.toContain('Sacola eco EcoTech');
});
