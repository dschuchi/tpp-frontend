import { type Locator, type Page, expect } from '@playwright/test';

export class RawMaterialsPage {
  readonly page: Page;
  readonly newRawMaterialLink: Locator;
  readonly confirmDeleteButton: Locator;
  readonly confirmRestoreButton: Locator;

  constructor(page: Page) {
    this.page = page;
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

  async findRawMaterialRow(name: string) {
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
          response.url().includes('raw-materials') && response.request().method() === 'GET'
        );
        await nextButton.click();
        await responsePromise;
      }
    } while (hasNextPage);
    return row.first();
  }

  async gotoEditRawMaterial(name: string) {
    const row = await this.findRawMaterialRow(name);
    const editButton = row.getByRole('button').filter({ has: this.page.locator('i.mdi-pencil') });
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();
  }

  async verifyRawMaterialVisible(name: string) {
    const row = await this.findRawMaterialRow(name);
    await expect(row).toBeVisible();
  }

  async deleteRawMaterial(name: string) {
    const row = await this.findRawMaterialRow(name);
    await row.getByRole('button').filter({ has: this.page.locator('i.mdi-delete') }).click();
    await expect(this.page.getByText('¿Estás seguro de que querés desactivar esta materia prima?')).toBeVisible();
    await this.confirmDeleteButton.click();
  }

  async restoreRawMaterial(name: string) {
    const row = await this.findRawMaterialRow(name);
    await row.getByRole('button').filter({ has: this.page.locator('i.mdi-delete-restore') }).click();
    await expect(this.page.getByText('¿Estás seguro de que querés activar esta materia prima?')).toBeVisible();
    await this.confirmRestoreButton.click();
  }
}
