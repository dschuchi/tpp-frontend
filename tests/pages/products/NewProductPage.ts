import { type Locator, type Page } from '@playwright/test';
import { ProductForm } from '../../components/ProductForm';

export class NewProductPage {
  readonly page: Page;
  readonly productForm: ProductForm;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productForm = new ProductForm(page);
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
  }

  async createProduct(product: { name: string; version: string; customerName?: string; observations?: string }) {
    await this.productForm.fillName(product.name);
    await this.productForm.fillVersion(product.version);
    await this.productForm.selectCustomer(product.customerName);
    if (product.observations) {
      await this.productForm.fillObservations(product.observations);
    }
    await this.saveButton.click();
  }
}
