import { type Locator, type Page } from '@playwright/test';

export class RolesForm {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Nombre del rol');
    this.descriptionInput = page.getByLabel('Descripción');
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }
}
