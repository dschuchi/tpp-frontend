import { type Locator, type Page, expect } from '@playwright/test';
import { SupplierForm } from '../../components/SupplierForm';

export class EditSupplierPage {
  readonly page: Page;
  readonly supplierForm: SupplierForm;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.supplierForm = new SupplierForm(page);
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
  }

  async updateSupplier(supplier: { name?: string, tax_id?: string, address?: string, phone?: string, email?: string }) {
    await expect(this.supplierForm.nameInput).not.toHaveValue('');

    if (supplier.name) await this.supplierForm.fillName(supplier.name);
    if (supplier.tax_id) await this.supplierForm.fillTaxId(supplier.tax_id);
    if (supplier.address) await this.supplierForm.fillAddress(supplier.address);
    if (supplier.phone) await this.supplierForm.fillPhone(supplier.phone);
    if (supplier.email) await this.supplierForm.fillEmail(supplier.email);

    await this.saveButton.click();
  }
}
