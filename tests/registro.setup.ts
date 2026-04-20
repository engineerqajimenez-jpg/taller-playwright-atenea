import {test as setup, expect} from '@playwright/test';
import TestData from '../data/testData.json' with { type: "json" };
import { backendUtils } from '../utils/backendUtils.js';
import { LoginPage } from '../pages/loginPage.js';
import { DashboardPage } from '../pages/dashboardPage.js';
import { ModalCrearCuenta} from '../pages/modalCrearCuenta.js';
import fs from 'fs/promises';
import path from 'path';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let modalCrearCuenta: ModalCrearCuenta;

const usuarioEnviaAuthFile = 'playwright/.auth/usuarioEnvia.json';
const usuarioRecibeAuthFile = 'playwright/.auth/usuarioRecibe.json';
const usuarioEnviaDataFile = 'playwright/.auth/usuarioEnvia.data.json';

setup.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  modalCrearCuenta = new ModalCrearCuenta(page);
  await loginPage.visitarPaginaLogin();
});

setup('Generar usuario que envia dinero', async ({ page, request }) => {
     const nuevoUsuario = await backendUtils.crearUsuarioPorApi(request, TestData.usuarioValido);

// Guardar datos del usuario que envia dinero para uso en otros tests
// Cambia lo que tengas en la línea 29 por esto:
await page.context().storageState({ path: 'playwright/.auth/usuarioEnvia.json' });

  await loginPage.completarYHacerClickBotonLogin(nuevoUsuario);
  await dashboardPage.botonDeAgregarCuenta.click();
  await modalCrearCuenta.seleccionarTipoDeCuenta('Débito');
  await modalCrearCuenta.ingresarMontoInicial('1000');
  await modalCrearCuenta.botonCrearCuenta.click();
  await expect(page.getByText('¡Cuenta creada exitosamente!')).toBeVisible();
  await page.context().storageState({ path: usuarioEnviaAuthFile });
});

setup('Loguearse con usuario que recibe dinero', async ({ page }) => {
  await loginPage.completarYHacerClickBotonLogin(TestData.usuarioValido);
await expect(dashboardPage.dashboardTitle).toBeVisible({ timeout: 30000 });});