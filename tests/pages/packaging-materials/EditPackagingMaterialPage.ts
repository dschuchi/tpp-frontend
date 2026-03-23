import { type Locator, type Page, expect } from '@playwright/test';
import { PackagingMaterialForm } from '../../components/PackagingMaterialForm';

export class EditPackagingMaterialPage {
  readonly page: Page;
  readonly packagingMaterialForm: PackagingMaterialForm;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.packagingMaterialForm = new PackagingMaterialForm(page);
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
  }

  async updatePackagingMaterial(packagingMaterial: { code?: string; description?: string }) {
    await expect(this.packagingMaterialForm.codeInput).not.toHaveValue('');

    if (packagingMaterial.code) await this.packagingMaterialForm.fillCode(packagingMaterial.code);
    if (packagingMaterial.description) await this.packagingMaterialForm.fillDescription(packagingMaterial.description);

    await this.saveButton.click();
  }
}
