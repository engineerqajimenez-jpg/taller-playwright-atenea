import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import TestData from '../data/testData.json';
import { DashboardPage } from '../pages/dashboardPage';

let loginPage: LoginPage;  
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await loginPage.visitarPaginaLogin();

});

test('TC-7 Verificar login exitoso', async ({ page }) => {
  const responsePromiseLogin = page.waitForResponse('http://localhost:6007/api/auth/login')
  await loginPage.completarYHacerClickBotonLogin({email: TestData.usuarioValido.email, password: TestData.usuarioValido.password});
  await loginPage.hacerclickBotonLogin();
});

test('TC-11 Loguearse con un nuevo usuario creado por backend', async ({ page, request}) => {
  const email = TestData.usuarioValido.email.split('@')[0] + Date.now().toString() + '@email.com' + TestData.usuarioValido.email.split('@')[1];
  const response = await request.post('http://localhost:6007/api/auth/signup', {
    data: {
      firstName: TestData.usuarioValido.firstName,
      lastName: TestData.usuarioValido.lastName,
      email: email,
      password: TestData.usuarioValido.password
    }
  });
  expect(response.status()).toBe(201);

  const responsePromiseLogin = page.waitForResponse('http://localhost:6007/api/auth/login')
  await loginPage.completarYHacerClickBotonLogin({email: email, password: TestData.usuarioValido.password});
  await loginPage.hacerclickBotonLogin();
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
    email: email, 
  }));
});