import { type Locator, type Page, expect } from '@playwright/test';

export class UsersPage {
  readonly page: Page;
  readonly newUserLink: Locator;
  readonly nameInput: Locator;
  readonly lastnameInput: Locator;
  readonly emailInput: Locator;
  readonly roleSelect: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;
  readonly initialPasswordInput: Locator;
  readonly closeSuccessDialogButton: Locator;

  readonly deactivateDialogText: Locator;
  readonly confirmDeactivateButton: Locator;
  readonly activateDialogText: Locator;
  readonly confirmActivateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newUserLink = page.getByRole('link', { name: 'Nuevo Usuario' });
    this.nameInput = page.getByLabel('Nombre');
    this.lastnameInput = page.getByLabel('Apellido');
    this.emailInput = page.getByLabel('Correo electrónico');
    this.roleSelect = page.getByLabel('Rol');
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
    this.successMessage = page.getByText('Usuario creado exitosamente');
    this.initialPasswordInput = page.getByLabel('Contraseña inicial');
    this.closeSuccessDialogButton = page.getByRole('button', { name: 'Entendido, ir al listado' });

    this.deactivateDialogText = page.getByText('¿Estás seguro de que querés desactivar este usuario?');
    this.confirmDeactivateButton = page.getByRole('button', { name: 'Desactivar', exact: true });
    this.activateDialogText = page.getByText('¿Estás seguro de que querés activar este usuario?');
    this.confirmActivateButton = page.getByRole('button', { name: 'Activar', exact: true });
  }

  async goto() {
    await this.page.goto('/usuarios');
  }

  async createUser(user: { username: string, lastname: string, email: string }) {
    await this.newUserLink.click();
    await expect(this.page).toHaveURL('/usuarios/nuevo');

    await this.nameInput.fill(user.username);
    await this.lastnameInput.fill(user.lastname);
    await this.emailInput.fill(user.email);

    await this.saveButton.click();

    await expect(this.successMessage).toBeVisible();
    await expect(this.initialPasswordInput.first()).not.toBeEmpty();

    await this.closeSuccessDialogButton.click();
    await expect(this.page).toHaveURL('/usuarios');
  }

  async editUser(currentEmail: string, newName: string) {
    const userRow = this.page.getByRole('row', { name: currentEmail });
    const editButton = userRow.getByRole('button').filter({ has: this.page.locator('i.mdi-pencil') });
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();

    await expect(this.page).toHaveURL(/.*\/editar/);
    await this.nameInput.fill(newName);
    await this.saveButton.click();

    await expect(this.page).toHaveURL('/usuarios');
  }

  async toggleUserStatus(email: string) {
    const userRow = this.page.getByRole('row', { name: email });
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
    await expect(this.page.getByText(text)).toBeVisible();
  }
}
