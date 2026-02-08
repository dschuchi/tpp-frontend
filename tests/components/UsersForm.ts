import { type Locator, type Page } from '@playwright/test';

export class UsersForm {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly lastnameInput: Locator;
  readonly emailInput: Locator;
  readonly roleSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Nombre');
    this.lastnameInput = page.getByLabel('Apellido');
    this.emailInput = page.getByLabel('Correo electrónico');
    this.roleSelect = page.getByLabel('Rol');
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillLastname(lastname: string) {
    await this.lastnameInput.fill(lastname);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async selectRole(role: string) {
    await this.roleSelect.selectOption({ label: role }).catch(() => this.roleSelect.fill(role));
  }
}
