import { type Locator, type Page } from '@playwright/test';

export class CustomerForm {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly taxIdInput: Locator;
  readonly addressInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Nombre');
    this.taxIdInput = page.getByLabel('CUIT/CUIL');
    this.addressInput = page.getByLabel('Dirección');
    this.phoneInput = page.getByLabel('Teléfono');
    this.emailInput = page.getByLabel('Email');
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillTaxId(taxId: string) {
    await this.taxIdInput.fill(taxId);
  }

  async fillAddress(address: string) {
    await this.addressInput.fill(address);
  }

  async fillPhone(phone: string) {
    await this.phoneInput.fill(phone);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }
}
