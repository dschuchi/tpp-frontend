import { type Locator, type Page, expect } from '@playwright/test';

export class RolesPage {
    readonly page: Page;
    readonly newRoleLink: Locator;
    readonly nameInput: Locator;
    readonly descriptionInput: Locator;
    readonly saveButton: Locator;
    readonly deleteDialogParams: Locator;
    readonly confirmDeleteButton: Locator;
    readonly confirmRestoreButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newRoleLink = page.getByRole('link', { name: 'Nuevo Rol' });
        this.nameInput = page.getByLabel('Nombre del rol');
        this.descriptionInput = page.getByLabel('Descripción');
        this.saveButton = page.getByRole('button', { name: 'Guardar' });
        this.deleteDialogParams = page.getByText('¿Estás seguro de que querés desactivar este rol?');
        this.confirmDeleteButton = page.getByRole('button', { name: 'Desactivar', exact: true });
        this.confirmRestoreButton = page.getByRole('button', { name: 'Activar', exact: true });
    }

    async goto() {
        await this.page.goto('/roles');
    }

    async createRole(name: string, description: string) {
        await this.newRoleLink.click();
        await this.nameInput.fill(name);
        await this.descriptionInput.fill(description);
        await this.saveButton.click();
    }

    async editRoleDescription(roleName: string, newDescription: string) {
        const roleRow = this.page.getByRole('row', { name: roleName });
        await roleRow.getByRole('button').filter({ has: this.page.locator('i.mdi-pencil') }).click();
        await this.descriptionInput.fill(newDescription);
        await this.saveButton.click();
    }

    async verifyRoleVisible(name: string) {
        await expect(this.page.getByRole('cell', { name })).toBeVisible();
    }

    async deleteRole(roleName: string) {
        const roleRow = this.page.getByRole('row', { name: roleName });
        await roleRow.getByRole('button').filter({ has: this.page.locator('i.mdi-delete') }).click();
        await expect(this.deleteDialogParams).toBeVisible();
        await this.confirmDeleteButton.click();
    }

    async restoreRole(roleName: string) {
        const roleRow = this.page.getByRole('row', { name: roleName });
        await roleRow.getByRole('button').filter({ has: this.page.locator('i.mdi-delete-restore') }).click();
        await expect(this.page.getByText('¿Estás seguro de que querés activar este rol?')).toBeVisible();
        await this.confirmRestoreButton.click();
    }
}
