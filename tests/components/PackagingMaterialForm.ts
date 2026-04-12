import { type Locator, type Page } from '@playwright/test';

export class PackagingMaterialForm {
  readonly page: Page;
  readonly codeInput: Locator;
  readonly descriptionInput: Locator;
  readonly customerInput: Locator;
  readonly supplierInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.codeInput = page.getByLabel('Código');
    this.descriptionInput = page.getByLabel('Descripción');
    this.customerInput = page.getByRole('combobox', { name: 'Cliente' });
    this.supplierInput = page.getByRole('combobox', { name: 'Proveedor' });
  }

  async fillCode(code: string) {
    await this.codeInput.fill(code);
  }

  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async selectCustomer() {
    await this.customerInput.click({ force: true });
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitForTimeout(500);
    await this.page.keyboard.press('Enter');
  }

  async selectSupplier() {
    await this.supplierInput.click({ force: true });
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitForTimeout(500);
    await this.page.keyboard.press('Enter');
  }

  async clearCustomer() {
    await this.page.getByRole('button', { name: 'Clear Cliente' }).click();
  }

  async clearSupplier() {
    await this.page.getByRole('button', { name: 'Clear Proveedor' }).click();
  }
}
