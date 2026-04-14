import { type Locator, type Page, expect } from '@playwright/test';
import { PaginatedTable } from '../components/PaginatedTable';

export class RawMaterialsPage {
  readonly page: Page;
  readonly table: PaginatedTable;
  readonly newRawMaterialLink: Locator;
  readonly confirmDeleteButton: Locator;
  readonly confirmRestoreButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = new PaginatedTable(page, 'raw-materials');
    this.newRawMaterialLink = page.getByRole('link', { name: 'Nueva Materia Prima' });
    this.confirmDeleteButton = page.getByRole('button', { name: 'Desactivar', exact: true });
    this.confirmRestoreButton = page.getByRole('button', { name: 'Activar', exact: true });
  }

  async goto() {
    await this.page.goto('/raw-materials');
  }

  async gotoNewRawMaterial() {
    await this.newRawMaterialLink.click();
  }

  async gotoEditRawMaterial(name: string) {
    const row = await this.table.findRow(name);
    const editButton = row.getByRole('button').filter({ has: this.page.locator('i.mdi-pencil') });
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();
  }

  async verifyRawMaterialVisible(name: string) {
    const row = await this.table.findRow(name);
    await expect(row).toBeVisible();
  }

  async deleteRawMaterial(name: string) {
    const row = await this.table.findRow(name);
    await row.getByRole('button').filter({ has: this.page.locator('i.mdi-delete') }).click();
    await expect(this.page.getByText('¿Estás seguro de que querés desactivar esta materia prima?')).toBeVisible();
    await this.confirmDeleteButton.click();
    expect(row).toContainText('Inactivo')
  }

  async restoreRawMaterial(name: string) {
    const row = await this.table.findRow(name);
    await row.getByRole('button').filter({ has: this.page.locator('i.mdi-delete-restore') }).click();
    await expect(this.page.getByText('¿Estás seguro de que querés activar esta materia prima?')).toBeVisible();
    await this.confirmRestoreButton.click();
    expect(row).toContainText('Activo')
  }
}
