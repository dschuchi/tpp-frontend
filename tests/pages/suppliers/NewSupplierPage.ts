import { type Locator, type Page } from '@playwright/test';
import { SupplierForm } from '../../components/SupplierForm';

export class NewSupplierPage {
  readonly page: Page;
  readonly supplierForm: SupplierForm;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.supplierForm = new SupplierForm(page);
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
  }

  async createSupplier(supplier: { name: string, tax_id: string, address: string, phone: string, email: string }) {
    await this.supplierForm.fillName(supplier.name);
    await this.supplierForm.fillTaxId(supplier.tax_id);
    await this.supplierForm.fillAddress(supplier.address);
    await this.supplierForm.fillPhone(supplier.phone);
    await this.supplierForm.fillEmail(supplier.email);
    await this.saveButton.click();
  }
}
