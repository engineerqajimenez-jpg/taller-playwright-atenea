import {Page, Locator} from '@playwright/test';

export class ModalCrearCuenta {
  readonly page: Page;
  readonly tipoDeCuentaDropdown: Locator;
  readonly montoInput: Locator;
  readonly botonCrearCuenta: Locator;
  readonly botonCancelar: Locator;


  constructor(page: Page) {
    this.page = page; 
    this.tipoDeCuentaDropdown = page.getByRole('combobox', { name: 'Tipo de cuenta *' })
    this.montoInput = page.getByRole('spinbutton', { name: 'Monto inicial *' })
    this.botonCrearCuenta = page.getByTestId('boton-crear-cuenta')
    this.botonCancelar = page.getByTestId('boton-cancelar-crear-cuenta')
  }


  async seleccionarTipoDeCuenta(tipoDeCuenta: string) {
    await this.tipoDeCuentaDropdown.click();
    await this.page.getByRole('option', { name: tipoDeCuenta }).click();
  }

async ingresarMontoInicial(monto: string) {
  await this.montoInput.fill(monto);
}}
