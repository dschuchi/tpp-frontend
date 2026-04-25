import { type Locator, type Page, expect } from '@playwright/test';
import { UsersForm } from '../../components/UsersForm';

export class NewUserPage {
  readonly page: Page;
  readonly usersForm: UsersForm;
  readonly saveButton: Locator;
  readonly successMessage: Locator;
  readonly initialPasswordInput: Locator;
  readonly closeSuccessDialogButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usersForm = new UsersForm(page);
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
    this.successMessage = page.getByText('Usuario creado exitosamente');
    this.initialPasswordInput = page.getByLabel('Contraseña inicial');
    this.closeSuccessDialogButton = page.getByRole('button', { name: 'Entendido, ir al listado' });
  }

  async createUser(user: { username: string, lastname: string, email: string }) {
    await expect(this.page).toHaveURL('/users/new');

    await this.usersForm.fillName(user.username);
    await this.usersForm.fillLastname(user.lastname);
    await this.usersForm.fillEmail(user.email);

    await this.saveButton.click();

    await expect(this.successMessage).toBeVisible();
    await expect(this.initialPasswordInput.first()).not.toBeEmpty();

    await this.closeSuccessDialogButton.click();
    await expect(this.page).toHaveURL('/users');
  }

  async fillForm(user: { username: string, lastname: string, email: string }) {
    await this.usersForm.fillName(user.username);
    await this.usersForm.fillLastname(user.lastname);
    await this.usersForm.fillEmail(user.email);
  }

  async save() {
    await this.saveButton.click();
  }
}
