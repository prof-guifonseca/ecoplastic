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

test('/app/ index redireciona para o login', async ({ page }) => {
  await page.goto('/app/');
  await expect(page).toHaveURL(/\/app\/login\//);
});
