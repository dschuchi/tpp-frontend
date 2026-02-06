import { type Locator, type Page, expect } from '@playwright/test';

export class RolesPage {
  readonly page: Page;
  readonly newRoleLink: Locator;
  readonly deleteDialogParams: Locator;
  readonly confirmDeleteButton: Locator;
  readonly confirmRestoreButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newRoleLink = page.getByRole('link', { name: 'Nuevo Rol' });
    this.deleteDialogParams = page.getByText('¿Estás seguro de que querés desactivar este rol?');
    this.confirmDeleteButton = page.getByRole('button', { name: 'Desactivar', exact: true });
    this.confirmRestoreButton = page.getByRole('button', { name: 'Activar', exact: true });
  }

  async goto() {
    await this.page.goto('/roles');
  }

  async gotoNewRole() {
    await this.newRoleLink.click();
  }

  async gotoEditRole(roleName: string) {
    const roleRow = this.page.getByRole('row', { name: roleName });
    const editButton = roleRow.getByRole('button').filter({ has: this.page.locator('i.mdi-pencil') });
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();
  }

  async verifyRoleVisible(name: string) {
    await expect(this.page.getByRole('cell', { name })).toBeVisible();
  }

  async deleteRole(roleName: string) {
    const roleRow = this.page.getByRole('row', { name: roleName });
    await roleRow.getByRole('button').filter({ has: this.page.locator('i.mdi-delete') }).click();
    await expect(this.deleteDialogParams).toBeVisible();
    await this.confirmDeleteButton.click();
  }

  async restoreRole(roleName: string) {
    const roleRow = this.page.getByRole('row', { name: roleName });
    await roleRow.getByRole('button').filter({ has: this.page.locator('i.mdi-delete-restore') }).click();
    await expect(this.page.getByText('¿Estás seguro de que querés activar este rol?')).toBeVisible();
    await this.confirmRestoreButton.click();
  }
}
