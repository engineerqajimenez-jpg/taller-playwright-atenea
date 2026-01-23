import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/registerpage';
import testData from '../data/testData.json';

let registerPage: RegisterPage;
test.beforeEach(async ({ page }) => {
  registerPage = new RegisterPage(page);
  await registerPage.visitarPaginaRegistro();
});

test('TC-1 Verificacion de elementos visuales en la pagina de registro', async ({ page }) => {
  await expect(registerPage.firstNameInput).toBeVisible();
  await expect(registerPage.lastNameInput).toBeVisible();
  await expect(registerPage.emailInput).toBeVisible();
  await expect(registerPage.passwordInput).toBeVisible();
  await expect(registerPage.registerButton).toBeVisible();
  await expect(registerPage.loginButton).toBeVisible();
});

test('TC-2 Verificar Boton de registro esta deshabilitado por defecto', async ({ page }) => {
  await expect(registerPage.registerButton).toBeDisabled();
});

test('TC-3 Verificar que el boton de registro se habilite al completar los campos obligatorios', async ({ page }) => {
  await registerPage.completarFormularioRegistro(testData.usuarioValido);
  await expect(registerPage.registerButton).toBeEnabled();
});


test('TC-4 Verificar redireccionamiento a pagina de inicio de sesion al hacer click', async ({ page }) => {
  await registerPage.loginButton.click();
  await expect(page).toHaveURL('http://localhost:3000/login');
});

test('TC-5 Verificar registro exitosos con datos validos', async ({ page }) => {
  test.step('Completar el formulario de registro con datos validos', async () => {
    const email = testData.usuarioValido.email.split('@')[0] + Date.now().toString() + '@email.com' + testData.usuarioValido.email.split('@')[1];
    testData.usuarioValido.email = email;
    await registerPage.completarYHacerClickBotonRegistro(testData.usuarioValido);
  });
  await expect(page.getByText('Registro exitoso')).toBeVisible();
});

test('TC-6 Verificar que un usuario no pueda registrarse con un correo electronico ya existente', async ({ page }) => {
  const email = testData.usuarioValido.email.split('@')[0] + Date.now().toString() + '@email.com' + testData.usuarioValido.email.split('@')[1];
  testData.usuarioValido.email = email;
  await registerPage.completarYHacerClickBotonRegistro(testData.usuarioValido);
  await expect(page.getByText('Registro exitoso')).toBeVisible();
  await registerPage.visitarPaginaRegistro();
  await registerPage.completarYHacerClickBotonRegistro(testData.usuarioValido);
  await expect(page.getByText('Email already in use')).toBeVisible();
  await expect(page.getByText('Registro exitoso')).not.toBeVisible();
});