import { type Locator, type Page, expect } from '@playwright/test';
import { ProductForm } from '../../components/ProductForm';

export class EditProductPage {
  readonly page: Page;
  readonly productForm: ProductForm;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productForm = new ProductForm(page);
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
  }

  async updateProduct(product: { name?: string; version?: string; customerName?: string; observations?: string }) {
    await expect(this.productForm.nameInput).not.toHaveValue('');

    if (product.name) await this.productForm.fillName(product.name);
    if (product.version) await this.productForm.fillVersion(product.version);
    if (product.customerName) await this.productForm.selectCustomer(product.customerName);
    if (product.observations) await this.productForm.fillObservations(product.observations);

    await this.saveButton.click();
  }
}
