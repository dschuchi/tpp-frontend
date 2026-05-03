import { type Locator, type Page } from '@playwright/test';

export class PurchaseForm {
  readonly page: Page;
  readonly supplierInput: Locator;
  readonly scheduledDateInput: Locator;
  readonly receivedDateInput: Locator;
  readonly observationInput: Locator;
  readonly addItemButton: Locator;

  // Dialog locators
  readonly rawMaterialInput: Locator;
  readonly packagingMaterialInput: Locator;
  readonly quantityInput: Locator;
  readonly unitPriceInput: Locator;
  readonly dialogAddButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.supplierInput = page.getByRole('combobox', { name: 'Proveedor' });
    this.scheduledDateInput = page.getByRole('textbox', { name: 'Fecha Programada' })
    this.receivedDateInput = page.getByRole('textbox', { name: 'Fecha de Recepción' })
    this.observationInput = page.getByLabel('Observaciones');
    this.addItemButton = page.getByRole('button', { name: 'Agregar Ítem' });

    // Dialog inputs
    this.rawMaterialInput = page.getByRole('combobox', { name: 'Materia Prima' });
    this.packagingMaterialInput = page.getByRole('combobox', { name: 'Material de Empaque' });
    this.quantityInput = page.getByLabel('Cantidad');
    this.unitPriceInput = page.getByLabel('Precio Unitario');
    this.dialogAddButton = page.getByRole('dialog').getByRole('button', { name: 'Agregar' });
  }

  async selectSupplier() {
    await this.supplierInput.click({ force: true });
    await this.page.waitForTimeout(500);
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitForTimeout(500);
    await this.page.keyboard.press('Enter');
  }

  async fillScheduledDate(date: string) {
    await this.scheduledDateInput.fill(date);
  }

  async fillReceivedDate(date: string) {
    await this.receivedDateInput.fill(date);
  }

  async fillObservation(obs: string) {
    await this.observationInput.fill(obs);
  }

  async addRawMaterialItem(quantity: number, price: string) {
    await this.addItemButton.click();
    await this.rawMaterialInput.click({ force: true });
    await this.page.waitForTimeout(500);
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitForTimeout(500);
    await this.page.keyboard.press('Enter');

    await this.quantityInput.fill(quantity.toString());
    await this.unitPriceInput.fill(price);
    await this.dialogAddButton.click();
  }

  async addPackagingMaterialItem(quantity: number, price: string) {
    await this.addItemButton.click();
    await this.packagingMaterialInput.click({ force: true });
    await this.page.waitForTimeout(500);
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitForTimeout(500);
    await this.page.keyboard.press('Enter');

    await this.quantityInput.fill(quantity.toString());
    await this.unitPriceInput.fill(price);
    await this.dialogAddButton.click();
  }
}
