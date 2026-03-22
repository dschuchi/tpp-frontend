import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly notification: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByPlaceholder('ejemplo@correo.com');
        this.passwordInput = page.getByPlaceholder('Ingresá tu contraseña');
        this.loginButton = page.getByRole('button', { name: 'Acceder' });
        this.notification = page.locator('.v-snackbar__content');
    }

    async goto() {
        await this.page.goto('/login');
    }

    async login(email: string, pass: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(pass);
        await this.loginButton.click();
    }
}
