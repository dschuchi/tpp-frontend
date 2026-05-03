import { type Locator, type Page, expect } from '@playwright/test';
import { PaginatedTable } from '../components/PaginatedTable';

export class PurchasesPage {
  readonly page: Page;
  readonly table: PaginatedTable;
  readonly newPurchaseLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = new PaginatedTable(page, 'purchase');
    this.newPurchaseLink = page.getByRole('link', { name: 'Nueva Compra' });
  }

  async goto() {
    await this.page.goto('/purchases');
  }

  async gotoNewPurchase() {
    await this.newPurchaseLink.click();
  }

  async gotoEditPurchase(supplierNameOrId: string) {
    const row = await this.table.findRow(supplierNameOrId);
    const editButton = row.getByRole('button').filter({ has: this.page.locator('i.mdi-pencil') });
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();
  }

  async verifyPurchaseVisible(supplierNameOrId: string) {
    const row = await this.table.findRow(supplierNameOrId);
    await expect(row).toBeVisible();
  }
}
