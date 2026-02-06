import { type Locator, type Page } from '@playwright/test';
import { RolesForm } from '../../components/RolesForm';

export class NewRolePage {
  readonly page: Page;
  readonly rolesForm: RolesForm;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rolesForm = new RolesForm(page);
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
  }

  async goto() {
    await this.page.goto('/roles/nuevo');
  }

  async createRole(name: string, description: string) {
    await this.rolesForm.fillName(name);
    await this.rolesForm.fillDescription(description);
    await this.saveButton.click();
  }
}
