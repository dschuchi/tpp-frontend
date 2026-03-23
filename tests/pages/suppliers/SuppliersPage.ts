import { type Locator, type Page, expect } from '@playwright/test';
import { PaginatedTable } from '../components/PaginatedTable';

export class SuppliersPage {
  readonly page: Page;
  readonly table: PaginatedTable;
  readonly newSupplierLink: Locator;
  readonly confirmDeleteButton: Locator;
  readonly confirmRestoreButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = new PaginatedTable(page, 'suppliers');
    this.newSupplierLink = page.getByRole('link', { name: 'Nuevo Proveedor' });
    this.confirmDeleteButton = page.getByRole('button', { name: 'Desactivar', exact: true });
    this.confirmRestoreButton = page.getByRole('button', { name: 'Activar', exact: true });
  }

  async goto() {
    await this.page.goto('/suppliers');
  }

  async gotoNewSupplier() {
    await this.newSupplierLink.click();
  }

  async gotoEditSupplier(name: string) {
    const row = await this.table.findRow(name);
    const editButton = row.getByRole('button').filter({ has: this.page.locator('i.mdi-pencil') });
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();
  }

  async verifySupplierVisible(name: string) {
    const row = await this.table.findRow(name);
    await expect(row).toBeVisible();
  }

  async deleteSupplier(name: string) {
    const row = await this.table.findRow(name);
    await row.getByRole('button').filter({ has: this.page.locator('i.mdi-delete') }).click();
    await expect(this.page.getByText('¿Estás seguro de que querés desactivar este proveedor?')).toBeVisible();
    await this.confirmDeleteButton.click();
  }

  async restoreSupplier(name: string) {
    const row = await this.table.findRow(name);
    await row.getByRole('button').filter({ has: this.page.locator('i.mdi-delete-restore') }).click();
    await expect(this.page.getByText('¿Estás seguro de que querés activar este proveedor?')).toBeVisible();
    await this.confirmRestoreButton.click();
  }
}
