import { test as setup } from '@playwright/test';

setup('login usuario envia', async ({ page }) => {
  await page.goto('http://localhost:3000/login'); 
  await page.fill('#email', process.env.USER_ENVIA_EMAIL!); // Usa secretos de GitHub
  await page.fill('#password', process.env.USER_ENVIA_PASS!);
  await page.click('button[type="submit"]');

  // Esto genera el archivo que tus tests están gritando que no encuentran
  await page.context().storageState({ path: 'playwright/.auth/usuarioEnvia.json' });
});