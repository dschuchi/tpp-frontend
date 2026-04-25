import { type Locator, type Page, expect } from '@playwright/test';
import { PaginatedTable } from '../components/PaginatedTable';

export class PackagingMaterialsPage {
  readonly page: Page;
  readonly table: PaginatedTable;
  readonly newPackagingMaterialLink: Locator;
  readonly confirmDeleteButton: Locator;
  readonly confirmRestoreButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = new PaginatedTable(page, 'packaging-materials');
    this.newPackagingMaterialLink = page.getByRole('link', { name: 'Nuevo Material de Empaque' });
    this.confirmDeleteButton = page.getByRole('button', { name: 'Desactivar', exact: true });
    this.confirmRestoreButton = page.getByRole('button', { name: 'Activar', exact: true });
  }

  async goto() {
    await this.page.goto('/packaging-materials');
  }

  async gotoNewPackagingMaterial() {
    await this.newPackagingMaterialLink.click();
  }

  async gotoEditPackagingMaterial(nameOrCode: string) {
    const row = await this.table.findRow(nameOrCode);
    const editButton = row.getByRole('button').filter({ has: this.page.locator('i.mdi-pencil') });
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();
  }

  async verifyPackagingMaterialVisible(nameOrCode: string) {
    const row = await this.table.findRow(nameOrCode);
    await expect(row).toBeVisible();
  }

  async deletePackagingMaterial(nameOrCode: string) {
    const row = await this.table.findRow(nameOrCode);
    await row.getByRole('button').filter({ has: this.page.locator('i.mdi-delete') }).click();
    await expect(this.page.getByText('¿Estás seguro de que querés desactivar este material de empaque?')).toBeVisible();
    await this.confirmDeleteButton.click();
    expect(row).toContainText('Inactivo')
  }

  async restorePackagingMaterial(nameOrCode: string) {
    const row = await this.table.findRow(nameOrCode);
    await row.getByRole('button').filter({ has: this.page.locator('i.mdi-delete-restore') }).click();
    await expect(this.page.getByText('¿Estás seguro de que querés activar este material de empaque?')).toBeVisible();
    await this.confirmRestoreButton.click();
    expect(row).toContainText('Activo')
  }
}
