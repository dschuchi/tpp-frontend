import { type Locator, type Page, expect } from '@playwright/test';

export class SuppliersPage {
  readonly page: Page;
  readonly newSupplierLink: Locator;
  readonly searchInput: Locator;
  readonly confirmDeleteButton: Locator;
  readonly confirmRestoreButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newSupplierLink = page.getByRole('link', { name: 'Nuevo Proveedor' });
    this.searchInput = page.getByLabel('Buscar');
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
    const row = this.page.getByRole('row', { name: name });
    const editButton = row.getByRole('button').filter({ has: this.page.locator('i.mdi-pencil') });
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();
  }

  async verifySupplierVisible(name: string) {
    await this.searchInput.fill(name);
    await expect(this.page.getByRole('cell', { name: name })).toBeVisible();
  }

  async deleteSupplier(name: string) {
    const row = this.page.getByRole('row', { name: name });
    await row.getByRole('button').filter({ has: this.page.locator('i.mdi-delete') }).click();
    await expect(this.page.getByText('¿Estás seguro de que querés desactivar este proveedor?')).toBeVisible();
    await this.confirmDeleteButton.click();
  }

  async restoreSupplier(name: string) {
    const row = this.page.getByRole('row', { name: name });
    await row.getByRole('button').filter({ has: this.page.locator('i.mdi-delete-restore') }).click();
    await expect(this.page.getByText('¿Estás seguro de que querés activar este proveedor?')).toBeVisible();
    await this.confirmRestoreButton.click();
  }
}
