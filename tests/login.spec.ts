import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import TestData from '../data/testData.json' with { type: 'json' };
import { DashboardPage } from '../pages/dashboardPage.js';
import { backendUtils } from '../utils/backendUtils.js';

let loginPage: LoginPage;  
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await loginPage.visitarPaginaLogin();

});

test('TC-7 Verificar login exitoso', async ({ page, request }) => {
  const nuevoUsuario = await backendUtils.crearUsuarioPorApi(request, TestData.usuarioValido);
  const responsePromiseLogin = page.waitForResponse('http://localhost:6007/api/auth/login');
  await loginPage.completarYHacerClickBotonLogin({ email: nuevoUsuario.email, password: nuevoUsuario.password });
  await expect(dashboardPage.dashboardTitle).toBeVisible();
});

test('TC-11 Loguearse con un nuevo usuario creado por backend', async ({ page, request}) => {
  const nuevoUsuario = await backendUtils.crearUsuarioPorApi(request, TestData.usuarioValido);

  const responsePromiseLogin = page.waitForResponse('http://localhost:6007/api/auth/login')
  await loginPage.completarYHacerClickBotonLogin({email: nuevoUsuario.email, password: nuevoUsuario.password});
  const responseLogin =  await responsePromiseLogin;
  const responseBodyLoginJson = await responseLogin.json();

  expect(responseLogin.status()).toBe(200);
  expect(responseBodyLoginJson).toHaveProperty('token');
  expect(typeof responseBodyLoginJson.token).toBe('string');
  expect(responseBodyLoginJson).toHaveProperty('user');
  expect(responseBodyLoginJson.user).toEqual(expect.objectContaining({
    id: expect.any(String),
    firstName: TestData.usuarioValido.firstName,
    lastName: TestData.usuarioValido.lastName,
    email: nuevoUsuario.email, 
  }));
});