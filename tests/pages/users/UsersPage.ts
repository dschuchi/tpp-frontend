import { type Locator, type Page, expect } from '@playwright/test';
import { PaginatedTable } from '../components/PaginatedTable';

export class UsersPage {
  readonly page: Page;
  readonly table: PaginatedTable;
  readonly newUserLink: Locator;

  readonly deactivateDialogText: Locator;
  readonly confirmDeactivateButton: Locator;
  readonly activateDialogText: Locator;
  readonly confirmActivateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = new PaginatedTable(page, 'users');
    this.newUserLink = page.getByRole('link', { name: 'Nuevo Usuario' });

    this.deactivateDialogText = page.getByText('¿Estás seguro de que querés desactivar este usuario?');
    this.confirmDeactivateButton = page.getByRole('button', { name: 'Desactivar', exact: true });
    this.activateDialogText = page.getByText('¿Estás seguro de que querés activar este usuario?');
    this.confirmActivateButton = page.getByRole('button', { name: 'Activar', exact: true });
  }

  async goto() {
    await this.page.goto('/users');
  }

  async gotoNewUser() {
    await this.newUserLink.click();
  }

  async gotoEditUser(email: string) {
    const userRow = await this.table.findRow(email);
    const editButton = userRow.getByRole('button').filter({ has: this.page.locator('i.mdi-pencil') });
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();
  }

  async toggleUserStatus(email: string) {
    const userRow = await this.table.findRow(email);
    await userRow.getByRole('button').filter({ has: this.page.locator('i.mdi-delete') }).click();

    await expect(this.deactivateDialogText).toBeVisible();
    await this.confirmDeactivateButton.click();
    expect(userRow).toContainText('Inactivo')

    const restoreButton = userRow.getByRole('button').filter({ has: this.page.locator('i.mdi-delete-restore') });
    await expect(restoreButton).toBeVisible();

    await restoreButton.click();
    await expect(this.activateDialogText).toBeVisible();
    await this.confirmActivateButton.click();
    expect(userRow).toContainText('Activo')

    await expect(userRow.getByRole('button').filter({ has: this.page.locator('i.mdi-delete') })).toBeVisible();
  }

  async verifyUserVisible(text: string) {
    const userRow = await this.table.findRow(text);
    await expect(userRow).toBeVisible();
  }
}
