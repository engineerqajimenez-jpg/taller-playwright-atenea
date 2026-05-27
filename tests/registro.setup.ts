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

  await loginPage.completarYHacerClickBotonLogin(nuevoUsuario);
  await dashboardPage.botonDeAgregarCuenta.click();
  await modalCrearCuenta.seleccionarTipoDeCuenta('Débito');
  await modalCrearCuenta.ingresarMontoInicial('1000');
  await modalCrearCuenta.botonCrearCuenta.click();
  await expect(page.getByText('¡Cuenta creada exitosamente!')).toBeVisible();
  
  // Guardar email del usuario que envia para usarlo en transacciones
  await fs.writeFile(
    path.resolve(usuarioEnviaDataFile),
    JSON.stringify({ email: nuevoUsuario.email })
  );
  
  await page.context().storageState({ path: usuarioEnviaAuthFile });
});

setup('Loguearse con usuario que recibe dinero', async ({ page, request }) => {
  const nuevoUsuario = await backendUtils.crearUsuarioPorApi(request, TestData.usuarioRecibe);
  await loginPage.completarYHacerClickBotonLogin(nuevoUsuario);
  await expect(dashboardPage.dashboardTitle).toBeVisible({ timeout: 15000 });
  
  // Crear cuenta para poder recibir transferencias
  await dashboardPage.botonDeAgregarCuenta.click();
  await modalCrearCuenta.seleccionarTipoDeCuenta('Débito');
  await modalCrearCuenta.ingresarMontoInicial('0');
  await modalCrearCuenta.botonCrearCuenta.click();
  await expect(page.getByText('¡Cuenta creada exitosamente!')).toBeVisible();

  // Guardar email del usuario que recibe
  await fs.writeFile(
    path.resolve('playwright/.auth/usuarioRecibe.data.json'),
    JSON.stringify({ email: nuevoUsuario.email })
  );
  
  await page.context().storageState({ path: usuarioRecibeAuthFile });
});