import { type Locator, type Page, expect } from '@playwright/test';
import { UsersForm } from '../../components/UsersForm';

export class EditUserPage {
  readonly page: Page;
  readonly usersForm: UsersForm;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usersForm = new UsersForm(page);
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
  }

  async updateUser(newName: string) {
    await expect(this.page).toHaveURL(/.*\/editar/);
    await this.usersForm.fillName(newName);
    await this.saveButton.click();
    await expect(this.page).toHaveURL('/usuarios');
  }
}
