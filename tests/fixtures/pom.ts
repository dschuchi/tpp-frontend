import { test as base } from '@playwright/test';
import { AppBar } from '../layouts/AppBar';
import { UsersPage } from '../pages/UsersPage';
import { LoginPage } from '../pages/LoginPage';
import { RolesPage } from '../pages/roles/RolesPage';
import { EditRolePage } from '../pages/roles/EditRolePage';
import { NewRolePage } from '../pages/roles/NewRolePage';

type POMFixtures = {
  appBar: AppBar
  usersPage: UsersPage
  loginPage: LoginPage
  rolesPage: RolesPage
  editRolePage: EditRolePage
  newRolePage: NewRolePage
};

export const test = base.extend<POMFixtures>({
  appBar: async ({ page }, use) => {
    await use(new AppBar(page));
  },
  usersPage: async ({ page }, use) => {
    await use(new UsersPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  rolesPage: async ({ page }, use) => {
    await use(new RolesPage(page));
  },
  editRolePage: async ({ page }, use) => {
    await use(new EditRolePage(page));
  },
  newRolePage: async ({ page }, use) => {
    await use(new NewRolePage(page));
  },
});

export { expect } from '@playwright/test';
