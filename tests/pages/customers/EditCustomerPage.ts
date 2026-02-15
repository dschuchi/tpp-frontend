import { type Locator, type Page, expect } from '@playwright/test';
import { CustomerForm } from '../../components/CustomerForm';

export class EditCustomerPage {
  readonly page: Page;
  readonly customerForm: CustomerForm;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.customerForm = new CustomerForm(page);
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
  }

  async updateCustomer(customer: { name?: string, tax_id?: string, address?: string, phone?: string, email?: string }) {
    await expect(this.customerForm.nameInput).not.toHaveValue('');

    if (customer.name) await this.customerForm.fillName(customer.name);
    if (customer.tax_id) await this.customerForm.fillTaxId(customer.tax_id);
    if (customer.address) await this.customerForm.fillAddress(customer.address);
    if (customer.phone) await this.customerForm.fillPhone(customer.phone);
    if (customer.email) await this.customerForm.fillEmail(customer.email);

    await this.saveButton.click();
  }
}
