import {test, expect} from '@playwright/test'
import { createRequire } from 'module';
import { DashboardPage } from '../pages/dashboardPage.js';
import { ModalEnviarTransferencia } from '../pages/modalEnviarTransferencia.js';
import TestData from '../data/testData.json' with { type: 'json' };
import fs from 'node:fs/promises';

let dashboardPage: DashboardPage;
let modalEnviarTransferencia: ModalEnviarTransferencia;

const require = createRequire(import.meta.url);

const testUsuarioEnvia= test.extend({
    storageState: require.resolve('../playwright/.auth/usuarioEnvia.json')
})

const testUsuarioRecibe= test.extend({
    storageState: require.resolve('../playwright/.auth/usuarioRecibe.json')
})

test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    modalEnviarTransferencia = new ModalEnviarTransferencia(page);
    await dashboardPage.visitarPaginaDashboard();
})

testUsuarioEnvia('TC-12 Verificar transasccion exitosa', async ({page}) => {
    const usuarioRecibeData = require.resolve('../playwright/.auth/usuarioRecibe.data.json');
    const contenido = await fs.readFile(usuarioRecibeData, 'utf-8');
    const { email: emailRecibe } = JSON.parse(contenido);
    
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    await dashboardPage.botonEnviarDinero.click();
    await modalEnviarTransferencia.completarYHacerClickBotonEnviar(emailRecibe, '100')
    await expect(page.getByText('Transferencia enviada a ' + emailRecibe)).toBeVisible();
});

testUsuarioRecibe('TC-13 Verificar que el usuario recibe la transferencia', async ({page}) => {
    await expect(dashboardPage.dashboardTitle).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Transferencia de/).first()).toBeVisible({ timeout: 15000 });
})

// Test unificado que envia dinero por API y verifica en la UI.
testUsuarioRecibe('TC-14 Verificar transferencia recibida (Enviada por Api)', async ({page, request}) => {
// #1 Preparacion para lectura de datos y TOKEN del remitente

// Leemos el archivo de datos del usuario que envia pra obtener su email.
const usuarioEnviaData = require.resolve('../playwright/.auth/usuarioEnvia.data.json');
const usuarioEnviaContenidoData = await fs.readFile(usuarioEnviaData, 'utf-8');
const datoDeUsuarioEnvia = JSON.parse(usuarioEnviaContenidoData);
const datosDeUsuarioEnvia = datoDeUsuarioEnvia.email;
expect(datosDeUsuarioEnvia, 'No se pudo obtener el email del usuario que envia dinero').toBeDefined()

// leemos el archivo de autenticacion del usuario que envia para obtener su token.
const usuarioEnviaAuth = require.resolve('../playwright/.auth/usuarioEnvia.json');
const usuarioEnviaContenidoAuth = await fs.readFile(usuarioEnviaAuth, 'utf-8');
const datoDeUsuarioEnviaAuth = JSON.parse(usuarioEnviaContenidoAuth);

const jwtDeUsuarioEnvia = datoDeUsuarioEnviaAuth.origins[0]?.localStorage.find((item: { name: string }) => item.name === 'jwt');
expect(jwtDeUsuarioEnvia, 'No se pudo obtener el token JWT del usuario que envia dinero').toBeDefined();
const jwt = jwtDeUsuarioEnvia.value;

// #2 Accion: Obtener Cuenta y Enviar transferencia por API

// Primero obtenemos la cuenta del remitente para saber el ID de origen.
const respuestaDeCuentas = await request.get('http://localhost:6007/api/accounts', {
    headers: {
        'Authorization': `Bearer ${jwt}`,
    } 
});

expect(respuestaDeCuentas.ok(), `La API para obtener cuentas falló: ${respuestaDeCuentas.status()}`).toBeTruthy();
const cuentas = await respuestaDeCuentas.json();
expect(cuentas.length, 'El usuario que envia dinero no tiene cuentas disponibles').toBeGreaterThan(0) 
const idCuentaOrigen  = cuentas[0]._id; // Tomamos la primera cuenta disponible del usuario que envia dinero

const montoAleatorio = Math.floor(Math.random() * 100) + 1; // Monto aleatorio entre 1 y 100
console.log(`Enviando transferencia de $${montoAleatorio} desde la cuenta ${idCuentaOrigen} a ${datosDeUsuarioEnvia}`);

//ahora con todos los datos podemos enviar la transferencia de dinero de una cuenta a la otra 
const respuestaTransferencia = await request.post('http://localhost:6007/api/transactions/transfer', {
    headers: {
        'Authorization': `Bearer ${jwt}`,
    },
    data: {
        fromAccountId: idCuentaOrigen,
        toEmail: datosDeUsuarioEnvia,
        amount: montoAleatorio
    }
});

expect(respuestaTransferencia.ok(), `La API para transferir dinero falló: ${respuestaTransferencia.status()}`).toBeTruthy();

//#3 Verificacion: Comprobar que el monto llego al destinatario por UI

await page.reload(); // Recargamos la página para que se actualicen los datos.; 
await page.waitForLoadState('networkidle'); // Esperamos a que no haya más solicitudes de red pendientes;
await expect(dashboardPage.dashboardTitle).toBeVisible(); // Verificamos que el dashboard se muestre correctamente;

//Verificamos que se muestre el mail del remitente en la fila, en el primer lugar.
await expect(dashboardPage.elementosListaTransferencia.first()).toContainText('Transferencia de ' + datosDeUsuarioEnvia);

//Verificamos que se muestre el monto correcto.
// Usamos unas expresion regular para buscar el numero (ej. 5.00)
const regexMonto = new RegExp('\\+\\s*' + montoAleatorio.toFixed(2));
await expect(page.locator('[data-testid="monto-transaccion"]').filter({ hasText: regexMonto }).first()).toBeVisible();

await page.waitForTimeout(5000); // Esperamos un poco para poder ver el resultado antes de cerrar el navegador

}
);