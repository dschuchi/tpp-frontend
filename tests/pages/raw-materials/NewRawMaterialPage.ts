import { type Locator, type Page } from '@playwright/test';
import { RawMaterialForm } from '../../components/RawMaterialForm';

export class NewRawMaterialPage {
  readonly page: Page;
  readonly rawMaterialForm: RawMaterialForm;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rawMaterialForm = new RawMaterialForm(page);
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
  }

  async createRawMaterial(rawMaterial: { name: string }) {
    await this.rawMaterialForm.fillName(rawMaterial.name);
    await this.saveButton.click();
  }
}
