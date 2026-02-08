import { test as base } from '@playwright/test';
import { AppBar } from '../layouts/AppBar';
import { LoginPage } from '../pages/LoginPage';

import { RolesPage } from '../pages/roles/RolesPage';
import { EditRolePage } from '../pages/roles/EditRolePage';
import { NewRolePage } from '../pages/roles/NewRolePage';

import { UsersPage } from '../pages/users/UsersPage';
import { NewUserPage } from '../pages/users/NewUserPage';
import { EditUserPage } from '../pages/users/EditUserPage';

type POMFixtures = {
  appBar: AppBar
  loginPage: LoginPage

  rolesPage: RolesPage
  newRolePage: NewRolePage
  editRolePage: EditRolePage

  usersPage: UsersPage
  newUserPage: NewUserPage
  editUserPage: EditUserPage
};

export const test = base.extend<POMFixtures>({
  appBar: async ({ page }, use) => {
    await use(new AppBar(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  rolesPage: async ({ page }, use) => {
    await use(new RolesPage(page));
  },
  newRolePage: async ({ page }, use) => {
    await use(new NewRolePage(page));
  },
  editRolePage: async ({ page }, use) => {
    await use(new EditRolePage(page));
  },

  usersPage: async ({ page }, use) => {
    await use(new UsersPage(page));
  },
  newUserPage: async ({ page }, use) => {
    await use(new NewUserPage(page));
  },
  editUserPage: async ({ page }, use) => {
    await use(new EditUserPage(page));
  },
});

export { expect } from '@playwright/test';
