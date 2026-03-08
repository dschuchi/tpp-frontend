import { type Locator, type Page } from '@playwright/test';

export class RawMaterialForm {
  readonly page: Page;
  readonly nameInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Nombre');
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }
}
