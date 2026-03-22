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

  async findRoleRow(name: string) {
    const row = this.page.getByRole('row', { name: name });
    const nextButton = this.page.getByLabel('Next page');

    let hasNextPage = true;

    do {
      await this.page.waitForTimeout(500);

      if (await row.count() > 0 && await row.first().isVisible()) {
        return row.first();
      }

      hasNextPage = await nextButton.isVisible() && !(await nextButton.isDisabled());

      if (hasNextPage) {
        const responsePromise = this.page.waitForResponse(response => 
          response.url().includes('roles') && response.request().method() === 'GET'
        );
        await nextButton.click();
        await responsePromise;
      }
    } while (hasNextPage);
    return row.first();
  }

  async gotoEditRole(roleName: string) {
    const roleRow = await this.findRoleRow(roleName);
    const editButton = roleRow.getByRole('button').filter({ has: this.page.locator('i.mdi-pencil') });
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();
  }

  async verifyRoleVisible(name: string) {
    const roleRow = await this.findRoleRow(name);
    await expect(roleRow).toBeVisible();
  }

  async deleteRole(roleName: string) {
    const roleRow = await this.findRoleRow(roleName);
    await roleRow.getByRole('button').filter({ has: this.page.locator('i.mdi-delete') }).click();
    await expect(this.deleteDialogParams).toBeVisible();
    await this.confirmDeleteButton.click();
  }

  async restoreRole(roleName: string) {
    const roleRow = await this.findRoleRow(roleName);
    await roleRow.getByRole('button').filter({ has: this.page.locator('i.mdi-delete-restore') }).click();
    await expect(this.page.getByText('¿Estás seguro de que querés activar este rol?')).toBeVisible();
    await this.confirmRestoreButton.click();
  }
}
