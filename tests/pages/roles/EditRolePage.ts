import { type Locator, type Page, expect } from '@playwright/test';
import { RolesForm } from '../../components/RolesForm';

export class EditRolePage {
  readonly page: Page;
  readonly rolesForm: RolesForm;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rolesForm = new RolesForm(page);
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
  }

  async updateRole(name: string, description: string) {
     await expect(this.rolesForm.nameInput).not.toHaveValue('');
     await expect(this.rolesForm.descriptionInput).not.toHaveValue('');
     if (name) await this.rolesForm.fillName(name);
     if (description) await this.rolesForm.fillDescription(description);
     await this.saveButton.click();
  }
}
