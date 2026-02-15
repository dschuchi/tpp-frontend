import { type Locator, type Page } from '@playwright/test';
import { CustomerForm } from '../../components/CustomerForm';

export class NewCustomerPage {
  readonly page: Page;
  readonly customerForm: CustomerForm;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.customerForm = new CustomerForm(page);
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
  }

  async createCustomer(customer: { name: string, tax_id: string, address: string, phone: string, email: string }) {
    await this.customerForm.fillName(customer.name);
    await this.customerForm.fillTaxId(customer.tax_id);
    await this.customerForm.fillAddress(customer.address);
    await this.customerForm.fillPhone(customer.phone);
    await this.customerForm.fillEmail(customer.email);
    await this.saveButton.click();
  }
}
