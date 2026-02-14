import { type Locator, type Page, expect } from '@playwright/test';

export class UpdatedPasswordDialog {
  readonly page: Page;
  readonly acceptButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.acceptButton = page.getByRole('button', { name: 'Entendido, ir al Login' });
  }

  async accept() {
    await this.acceptButton.click();
  }
}
