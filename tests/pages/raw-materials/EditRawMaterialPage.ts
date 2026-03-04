import { type Locator, type Page, expect } from '@playwright/test';
import { RawMaterialForm } from '../../components/RawMaterialForm';

export class EditRawMaterialPage {
  readonly page: Page;
  readonly rawMaterialForm: RawMaterialForm;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rawMaterialForm = new RawMaterialForm(page);
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
  }

  async updateRawMaterial(rawMaterial: { name?: string }) {
    await expect(this.rawMaterialForm.nameInput).not.toHaveValue('');

    if (rawMaterial.name) await this.rawMaterialForm.fillName(rawMaterial.name);

    await this.saveButton.click();
  }
}
