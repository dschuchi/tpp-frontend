import { type Locator, type Page, expect } from '@playwright/test';
import { PaginatedTable } from '../components/PaginatedTable';

export class CustomersPage {
  readonly page: Page;
  readonly table: PaginatedTable;
  readonly newCustomerLink: Locator;
  readonly confirmDeleteButton: Locator;
  readonly confirmRestoreButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = new PaginatedTable(page, 'customers');
    this.newCustomerLink = page.getByRole('link', { name: 'Nuevo Cliente' });
    this.confirmDeleteButton = page.getByRole('button', { name: 'Desactivar', exact: true });
    this.confirmRestoreButton = page.getByRole('button', { name: 'Activar', exact: true });
  }

  async goto() {
    await this.page.goto('/customers');
  }

  async gotoNewCustomer() {
    await this.newCustomerLink.click();
  }

  async gotoEditCustomer(name: string) {
    const row = await this.table.findRow(name);
    const editButton = row.getByRole('button').filter({ has: this.page.locator('i.mdi-pencil') });
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();
  }

  async verifyCustomerVisible(name: string) {
    const row = await this.table.findRow(name);
    await expect(row).toBeVisible();
  }

  async deleteCustomer(name: string) {
    const row = await this.table.findRow(name);
    await row.getByRole('button').filter({ has: this.page.locator('i.mdi-delete') }).click();
    await expect(this.page.getByText('¿Estás seguro de que querés desactivar este cliente?')).toBeVisible();
    await this.confirmDeleteButton.click();
  }

  async restoreCustomer(name: string) {
    const row = await this.table.findRow(name);
    await row.getByRole('button').filter({ has: this.page.locator('i.mdi-delete-restore') }).click();
    await expect(this.page.getByText('¿Estás seguro de que querés activar este cliente?')).toBeVisible();
    await this.confirmRestoreButton.click();
  }
}
