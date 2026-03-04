import { type Locator, type Page, expect } from '@playwright/test';

export class RawMaterialsPage {
  readonly page: Page;
  readonly newRawMaterialLink: Locator;
  readonly searchInput: Locator;
  readonly confirmDeleteButton: Locator;
  readonly confirmRestoreButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newRawMaterialLink = page.getByRole('link', { name: 'Nueva Materia Prima' });
    this.searchInput = page.getByLabel('Buscar');
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
    const row = this.page.getByRole('row', { name: name });
    const editButton = row.getByRole('button').filter({ has: this.page.locator('i.mdi-pencil') });
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();
  }

  async verifyRawMaterialVisible(name: string) {
    await this.searchInput.fill(name);
    await expect(this.page.getByRole('cell', { name: name })).toBeVisible();
  }

  async deleteRawMaterial(name: string) {
    const row = this.page.getByRole('row', { name: name });
    await row.getByRole('button').filter({ has: this.page.locator('i.mdi-delete') }).click();
    await expect(this.page.getByText('¿Estás seguro de que querés desactivar esta materia prima?')).toBeVisible();
    await this.confirmDeleteButton.click();
  }

  async restoreRawMaterial(name: string) {
    const row = this.page.getByRole('row', { name: name });
    await row.getByRole('button').filter({ has: this.page.locator('i.mdi-delete-restore') }).click();
    await expect(this.page.getByText('¿Estás seguro de que querés activar esta materia prima?')).toBeVisible();
    await this.confirmRestoreButton.click();
  }
}
