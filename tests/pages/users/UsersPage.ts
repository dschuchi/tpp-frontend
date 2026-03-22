import { type Locator, type Page, expect } from '@playwright/test';

export class UsersPage {
  readonly page: Page;
  readonly newUserLink: Locator;

  readonly deactivateDialogText: Locator;
  readonly confirmDeactivateButton: Locator;
  readonly activateDialogText: Locator;
  readonly confirmActivateButton: Locator;

  constructor(page: Page) {
    this.page = page;
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

  async findUserRow(text: string) {
    const row = this.page.getByRole('row', { name: text });
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
          response.url().includes('users') && response.request().method() === 'GET'
        );
        await nextButton.click();
        await responsePromise;
      }
    } while (hasNextPage);
    return row.first();
  }

  async gotoEditUser(email: string) {
    const userRow = await this.findUserRow(email);
    const editButton = userRow.getByRole('button').filter({ has: this.page.locator('i.mdi-pencil') });
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();
  }

  async toggleUserStatus(email: string) {
    const userRow = await this.findUserRow(email);
    await userRow.getByRole('button').filter({ has: this.page.locator('i.mdi-delete') }).click();

    await expect(this.deactivateDialogText).toBeVisible();
    await this.confirmDeactivateButton.click();

    const restoreButton = userRow.getByRole('button').filter({ has: this.page.locator('i.mdi-delete-restore') });
    await expect(restoreButton).toBeVisible();

    await restoreButton.click();
    await expect(this.activateDialogText).toBeVisible();
    await this.confirmActivateButton.click();

    await expect(userRow.getByRole('button').filter({ has: this.page.locator('i.mdi-delete') })).toBeVisible();
  }

  async verifyUserVisible(text: string) {
    const userRow = await this.findUserRow(text);
    await expect(userRow).toBeVisible();
  }
}
