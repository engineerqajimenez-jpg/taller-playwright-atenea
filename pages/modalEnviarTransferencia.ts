import {Page, Locator} from '@playwright/test';

export class ModalEnviarTransferencia {
  readonly page: Page;
  readonly emailDestinatarioInput: Locator;
  readonly cuentaDeOrigenDropDown: Locator;
  readonly montoInput: Locator;
  readonly botonEnviar: Locator;
  readonly botonCancelar: Locator;
  readonly cuentaDeOrigenOption: Locator;


  constructor(page: Page) {
    this.page = page;
    this.emailDestinatarioInput = page.getByRole('textbox', { name: 'Email del destinatario *' })
    this.cuentaDeOrigenDropDown = page.getByRole('combobox', { name: 'Cuenta origen *' })
    this.montoInput = page.getByRole('spinbutton', { name: 'Monto a enviar *' })
    this.botonEnviar = page.getByRole('button', { name: 'Enviar' })
    this.botonCancelar = page.getByRole('button', { name: 'Cancelar' })
    this.cuentaDeOrigenOption = page.getByRole('option', { name: '••••' })
  }

  async completarYHacerClickBotonEnviar(emailDestinatario: string, monto: string) {
    await this.emailDestinatarioInput.fill(emailDestinatario);
    await this.cuentaDeOrigenDropDown.click();
    await this.cuentaDeOrigenOption.click();
    await this.montoInput.fill(monto);
    await this.botonEnviar.click();
  }
}
