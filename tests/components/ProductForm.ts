import { type Locator, type Page } from '@playwright/test';

export class ProductForm {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly versionInput: Locator;
  readonly customerInput: Locator;
  readonly observationsInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Nombre', { exact: true });
    this.versionInput = page.getByLabel('Versión', { exact: true });
    this.customerInput = page.getByRole('combobox', { name: 'Cliente' });
    this.observationsInput = page.getByLabel('Observaciones', { exact: true });
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillVersion(version: string) {
    await this.versionInput.fill(version);
  }

  async selectCustomer(customerName?: string) {
    await this.customerInput.click({ force: true });
    if (customerName) {
      await this.page.getByText(customerName, { exact: true }).click();
    } else {
      await this.page.keyboard.press('ArrowDown');
      await this.page.waitForTimeout(500);
      await this.page.keyboard.press('Enter');
    }
  }

  async fillObservations(observations: string) {
    await this.observationsInput.fill(observations);
  }
}
