import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/registerpage';
import testData from '../data/testData.json';
import { backendUtils } from '../utils/backendUtils';

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

test('TC-8 Verificar registro exitoso con datos validos verificando respuesta de la API', async ({ page }) => {
  test.step('Completar el formulario de registro con datos validos', async () => {
  const email = testData.usuarioValido.email.split('@')[0] + Date.now().toString() + '@email.com' + testData.usuarioValido.email.split('@')[1];
  testData.usuarioValido.email = email;
  await registerPage.completarYHacerClickBotonRegistro(testData.usuarioValido);
  });
  const responsePromise = page.waitForResponse('http://localhost:6007/api/auth/signup');
  await registerPage.hacerclickBotonRegistro();
  const response =  await responsePromise;
  const responseBody = await response.json();

  expect(response.status()).toBe(201);
  expect(responseBody).toHaveProperty('token');
  expect(typeof responseBody.token).toBe('string');
  expect(responseBody).toHaveProperty('user');
  expect(responseBody.user).toEqual(expect.objectContaining({
    id: expect.any(String),
    firstName: testData.usuarioValido.firstName,
    lastName: testData.usuarioValido.lastName,
    email: testData.usuarioValido.email
  }));

  await expect(page.getByText('Registro exitoso')).toBeVisible();
  
});

test('TC-9 Generar signup desde la API ', async ({ page, request}) => {
  const email = testData.usuarioValido.email.split('@')[0] + Date.now().toString() + '@email.com' + testData.usuarioValido.email.split('@')[1];
  const response = await request.post('http://localhost:6007/api/auth/signup', {
    headers: {
      'Accept': 'application/VND.github.v3+json',
      'Content-Type': 'application/json'
    },  
    data: {
      firstName: testData.usuarioValido.firstName,
      lastName: testData.usuarioValido.lastName,
      email: email,
      password: testData.usuarioValido.password
    }
  });
  const responseBody = await response.json();
  expect(response.status()).toBe(201);
  expect(responseBody).toHaveProperty('token');
  expect(typeof responseBody.token).toBe('string');
  expect(responseBody).toHaveProperty('user');
  expect(responseBody.user).toEqual(expect.objectContaining({
    id: expect.any(String),
    firstName: testData.usuarioValido.firstName,
    lastName: testData.usuarioValido.lastName,
    email: email
  }));
});

test('TC-10 Verificar comportamiento del front ante un error 500 en el registro', async ({ page }) => {
  const email = testData.usuarioValido.email.split('@')[0] + Date.now().toString() + '@email.com' + testData.usuarioValido.email.split('@')[1];

  // Interceptar la solicitud de registro y forzar un error 500
  await page.route('http://localhost:6007/api/auth/signup', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Internal Server Error' }),
    });
  });

  // Llenar el formulario. La navegacion se realiza en the beforeEach
  await registerPage.firstNameInput.fill(testData.usuarioValido.firstName);
  await registerPage.lastNameInput.fill(testData.usuarioValido.lastName);
  await registerPage.emailInput.fill(email);
  await registerPage.passwordInput.fill(testData.usuarioValido.password);

  // Hacer clic en el botón de registro
  await registerPage.hacerclickBotonRegistro();

  // Verificar que se muestra un mensaje de error 
  await expect(page.getByText('Internal Server Error')).toBeVisible();
});


