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

test('morador resgata recompensa e ve saldo e historico atualizados', async ({ page }) => {
  await page.goto('/app/login/?p=morador');
  await expect(page.getByRole('heading', { name: /Bom dia|Boa tarde|Boa noite/ })).toBeVisible();

  await page.getByRole('link', { name: /Trocar/ }).click();
  await expect(page.getByRole('heading', { name: 'Trocar pontos' })).toBeVisible();
  const saldoAntes = await page.locator('.p-balance .pts').textContent();

  // primeiro botao habilitado = recompensa que o saldo cobre e com estoque
  const trocar = page.locator('.p-reward button:not([disabled])').first();
  await expect(trocar).toBeVisible();
  await trocar.click();

  await page.getByRole('button', { name: 'Resgatar' }).click();
  await expect(page.getByText('Resgatado')).toBeVisible();
  await expect(page.locator('.p-balance .pts')).not.toHaveText(saldoAntes ?? '');

  await page.getByRole('link', { name: /Historico/ }).click();
  await expect(page.locator('.p-feed-item .pts.neg').first()).toBeVisible();
});

test('sindico reseta a demo e o ranking volta ao seed', async ({ page }) => {
  await page.goto('/app/login/?p=sindico');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  await page.getByRole('link', { name: /Config/ }).click();
  await expect(page.getByRole('heading', { name: 'Configuracoes' })).toBeVisible();
  await page.getByRole('button', { name: /Resetar demo/ }).click();

  // dialogo de confirmacao (tone danger) -> confirmLabel "Resetar"
  await page.getByRole('button', { name: 'Resetar', exact: true }).click();
  await expect(page.getByText('Dados resetados')).toBeVisible();

  await page.getByRole('link', { name: /Moradores/ }).click();
  await expect(page.locator('table.table tbody tr').first()).toContainText('Julia');
});

test('/app/ index redireciona para o login', async ({ page }) => {
  await page.goto('/app/');
  await expect(page).toHaveURL(/\/app\/login\//);
});
