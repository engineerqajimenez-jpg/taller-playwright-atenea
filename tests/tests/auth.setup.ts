// tests/auth.setup.ts
import { test as setup } from '@playwright/test';

setup('autenticacion usuario envia', async ({ page }) => {
  await page.goto('http://localhost:3000/login'); // Ajusta a tu URL
  
  // Usa las variables de entorno que configuraste en los Secrets
  await page.fill('#email', process.env.USER_ENVIA_EMAIL!);
  await page.fill('#password', process.env.USER_ENVIA_PASS!);
  await page.click('button[type="submit"]');

  // Espera a que el login termine (ej. ver el dashboard) antes de guardar
  await page.waitForURL('**/dashboard');

  // Genera el archivo que los tests van a buscar
  await page.context().storageState({ 
    path: './playwright/.auth/usuarioEnvia.json' 
  });
});