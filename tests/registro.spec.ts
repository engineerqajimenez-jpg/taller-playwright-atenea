import { test, expect } from '@playwright/test';

test('TC-1 Verificacion de elementos visuales en la pagina de registro', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.locator('input[name="firstName"]')).toBeVisible();
  await expect(page.locator('input[name="lastName"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.getByTestId('boton-registrarse')).toBeVisible();
  await page.waitForTimeout(5000);
  // Expect a title "to contain" a substring.
  //await expect(page).toHaveTitle(/Playwright/);
});

test('TC-2 Verificar Boton de registro esat deshabilitado por defecto', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByTestId('boton-registrarse')).toBeDisabled();
  await page.waitForTimeout(5000);
})

test('TC-3 Verificar que el boton de registro se habiliteal completar los campos obligatorios', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Jose');
  await page.locator('input[name="lastName"]').fill('Jimenez');
  await page.locator('input[name="email"]').fill('jose@email.com');
  await page.locator('input[name="password"]').fill('123456');
  await expect(page.getByTestId('boton-registrarse')).toBeEnabled();
  await page.waitForTimeout(5000);
});


test('TC-4 Verificar redireccionamiento a pagina de inicio de sesion al hacer click', async ({page}) => {
await page.goto('http://localhost:3000/');
await page.getByTestId('boton-login-header-signup').click();
await expect(page).toHaveURL('http://localhost:3000/login');
await page.waitForTimeout(5000);
});

test('TC-5 Verificar registro exitosos con datos validos', async ({page}) => {
 await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Jose');
  await page.locator('input[name="lastName"]').fill('Jimenez');
  await page.locator('input[name="email"]').fill('josegregorio'+Date.now().toString()+'@email.com');
  await page.locator('input[name="password"]').fill('123456');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Registro exitoso')).toBeVisible();
  await page.waitForTimeout(5000);
});

test('TC-6 Verificar que un usuario no pueda registrarse con un correo electronico ya existente', async ({page}) => {
  const email = 'josegregorio'+Date.now().toString()+'@email.com';
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Jose');
  await page.locator('input[name="lastName"]').fill('Jimenez');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill('123456');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Registro exitoso')).toBeVisible();
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Jose');
  await page.locator('input[name="lastName"]').fill('Jimenez');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill('123456');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Email already in use')).toBeVisible();
  await expect(page.getByText('Registro exitoso')).not.toBeVisible();

});