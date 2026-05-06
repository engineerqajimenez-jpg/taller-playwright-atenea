import { test as setup, expect } from '@playwright/test';

setup('login usuario envia', async ({ page }) => {
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 60000 });

  const emailInput = page.locator('input[name="email"]');
  await emailInput.waitFor({ state: 'visible', timeout: 30000 });

  await emailInput.fill(process.env.USER_ENVIA_EMAIL!);
  // CORRECCIÓN AQUÍ: Cambia EMAIL por PASS
  await page.locator('input[name="password"]').fill(process.env.USER_ENVIA_PASS!); 

  await page.click('button[type="submit"]');

  await page.waitForURL('**/dashboard', { timeout: 30000 });

  await page.context().storageState({ path: './playwright/.auth/usuarioEnvia.json' });
});