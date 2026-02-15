import { type Locator, type Page, expect } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly lastnameInput: Locator;
  readonly emailInput: Locator;
  readonly roleInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly changePasswordButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Nombre');
    this.lastnameInput = page.getByLabel('Apellido');
    this.emailInput = page.getByLabel('Correo');
    this.roleInput = page.getByLabel('Rol');
    this.passwordInput = page.getByLabel('Nueva Contraseña');
    this.confirmPasswordInput = page.getByLabel('Confirmar Contraseña');
    this.changePasswordButton = page.getByRole('button', { name: 'Cambiar Contraseña' });
  }

  async goto() {
    await this.page.goto('/profile');
  }

  async validateUserData(name: string, lastname: string, email: string, role: string) {
    await expect(this.nameInput).toHaveValue(name);
    await expect(this.lastnameInput).toHaveValue(lastname);
    await expect(this.emailInput).toHaveValue(email);
    await expect(this.roleInput).toHaveValue(role);
  }

  async updatePassword(password: string) {
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.changePasswordButton.click();
  }
}
