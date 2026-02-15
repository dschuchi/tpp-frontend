import { test as base } from '@playwright/test';
import { AppBar } from '../layouts/AppBar';
import { LoginPage } from '../pages/LoginPage';

import { RolesPage } from '../pages/roles/RolesPage';
import { EditRolePage } from '../pages/roles/EditRolePage';
import { NewRolePage } from '../pages/roles/NewRolePage';

import { UsersPage } from '../pages/users/UsersPage';
import { NewUserPage } from '../pages/users/NewUserPage';
import { EditUserPage } from '../pages/users/EditUserPage';

import { SuppliersPage } from '../pages/suppliers/SuppliersPage';
import { NewSupplierPage } from '../pages/suppliers/NewSupplierPage';
import { EditSupplierPage } from '../pages/suppliers/EditSupplierPage';

import { CustomersPage } from '../pages/customers/CustomersPage';
import { NewCustomerPage } from '../pages/customers/NewCustomerPage';
import { EditCustomerPage } from '../pages/customers/EditCustomerPage';

import { ProfilePage } from '../pages/profile/ProfilePage';
import { UpdatedPasswordDialog } from '../pages/profile/UpdatedPasswordDialog';

type POMFixtures = {
  appBar: AppBar
  loginPage: LoginPage

  rolesPage: RolesPage
  newRolePage: NewRolePage
  editRolePage: EditRolePage

  usersPage: UsersPage
  newUserPage: NewUserPage
  editUserPage: EditUserPage

  suppliersPage: SuppliersPage
  newSupplierPage: NewSupplierPage
  editSupplierPage: EditSupplierPage

  customersPage: CustomersPage
  newCustomerPage: NewCustomerPage
  editCustomerPage: EditCustomerPage

  profilePage: ProfilePage
  updatedPasswordDialog: UpdatedPasswordDialog
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

  suppliersPage: async ({ page }, use) => {
    await use(new SuppliersPage(page));
  },
  newSupplierPage: async ({ page }, use) => {
    await use(new NewSupplierPage(page));
  },
  editSupplierPage: async ({ page }, use) => {
    await use(new EditSupplierPage(page));
  },

  customersPage: async ({ page }, use) => {
    await use(new CustomersPage(page));
  },
  newCustomerPage: async ({ page }, use) => {
    await use(new NewCustomerPage(page));
  },
  editCustomerPage: async ({ page }, use) => {
    await use(new EditCustomerPage(page));
  },

  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  updatedPasswordDialog: async ({ page }, use) => {
    await use(new UpdatedPasswordDialog(page));
  },
});

export { expect } from '@playwright/test';
