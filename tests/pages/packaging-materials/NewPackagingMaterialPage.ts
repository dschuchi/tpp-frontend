import { type Locator, type Page } from '@playwright/test';
import { PackagingMaterialForm } from '../../components/PackagingMaterialForm';

export class NewPackagingMaterialPage {
  readonly page: Page;
  readonly packagingMaterialForm: PackagingMaterialForm;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.packagingMaterialForm = new PackagingMaterialForm(page);
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
  }

  async createPackagingMaterial(packagingMaterial: { code: string; description?: string }) {
    await this.packagingMaterialForm.fillCode(packagingMaterial.code);
    if (packagingMaterial.description) {
      await this.packagingMaterialForm.fillDescription(packagingMaterial.description);
    }
    await this.packagingMaterialForm.selectCustomer();
    await this.saveButton.click();
  }
}
