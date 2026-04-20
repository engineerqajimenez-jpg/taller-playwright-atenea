import { test as setup, expect } from '@playwright/test';

// En tests/auth.setup.ts
setup ('login usuario envia', async ({ page }) => {
  // 1. Aumentamos el timeout de navegación para CI
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 60000 }); 

  // 2. Esperamos explícitamente a que el campo de email sea visible
  await page.waitForSelector('#email', { state: 'visible', timeout: 60000 });
  
  await page.fill('#email', process.env.USER_ENVIA_EMAIL!);
  await page.fill('#password', process.env.USER_ENVIA_PASS!);
  await page.click('button[type="submit"]');

  // 3. Verificamos que el login fue exitoso antes de guardar el estado
  await expect(page.getByTestId('titulo-dashboard')).toBeVisible({ timeout: 60000 });

  await page.context().storageState({
    path: './playwright/.auth/usuarioEnvia.json'
  });
});