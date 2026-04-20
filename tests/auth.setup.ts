import { test as setup, expect } from '@playwright/test';

setup('login usuario envia', async ({ page }) => {
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 60000 });

  // Usamos getByLabel o getByPlaceholder que son más estables en React/Vite
  const emailInput = page.locator('input[name="email"]');
  await emailInput.waitFor({ state: 'visible', timeout: 30000 });
  
  await emailInput.fill(process.env.USER_ENVIA_EMAIL!);
  await page.locator('input[name="password"]').fill(process.env.USER_ENVIA_PASS!);
  
  await page.click('button[type="submit"]');

  // Esperamos a que la URL cambie para asegurar que el login procesó
  await page.waitForURL('**/dashboard', { timeout: 30000 });
  
  await page.context().storageState({ path: './playwright/.auth/usuarioEnvia.json' });
});