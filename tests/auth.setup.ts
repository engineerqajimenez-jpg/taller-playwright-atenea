import { test as setup, expect } from '@playwright/test';

setup('login usuario envia', async ({ page }) => {
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 60000 });

  await page.locator('input[name="email"]').fill(process.env.USER_ENVIA_EMAIL!);
  // REVISA ESTA LÍNEA: Debe decir PASS, no EMAIL
  await page.locator('input[name="password"]').fill(process.env.USER_ENVIA_PASS!);

  await page.click('button[type="submit"]');

  // CAMBIO CLAVE: Esperamos a que la red se detenga en el dashboard
  await page.waitForURL('**/dashboard', { waitUntil: 'networkidle', timeout: 60000 });
  
  // Verificamos que el título sea visible antes de guardar
  await expect(page.getByTestId('titulo-dashboard')).toBeVisible({ timeout: 15000 });

  await page.context().storageState({ path: './playwright/.auth/usuarioEnvia.json' });
});