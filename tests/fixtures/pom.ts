import { APIRequestContext, test as base } from '@playwright/test';
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

import { RawMaterialsPage } from '../pages/raw-materials/RawMaterialsPage';
import { NewRawMaterialPage } from '../pages/raw-materials/NewRawMaterialPage';
import { EditRawMaterialPage } from '../pages/raw-materials/EditRawMaterialPage';

import { PackagingMaterialsPage } from '../pages/packaging-materials/PackagingMaterialsPage';
import { NewPackagingMaterialPage } from '../pages/packaging-materials/NewPackagingMaterialPage';
import { EditPackagingMaterialPage } from '../pages/packaging-materials/EditPackagingMaterialPage';

import { ProductsPage } from '../pages/products/ProductsPage';
import { NewProductPage } from '../pages/products/NewProductPage';
import { EditProductPage } from '../pages/products/EditProductPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { UpdatedPasswordDialog } from '../pages/profile/UpdatedPasswordDialog';
import { getAuthContext } from '../utils/api-client';

type POMFixtures = {
  apiOwner: APIRequestContext

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

  rawMaterialsPage: RawMaterialsPage
  newRawMaterialPage: NewRawMaterialPage
  editRawMaterialPage: EditRawMaterialPage

  packagingMaterialsPage: PackagingMaterialsPage
  newPackagingMaterialPage: NewPackagingMaterialPage
  editPackagingMaterialPage: EditPackagingMaterialPage

  productsPage: ProductsPage
  newProductPage: NewProductPage
  editProductPage: EditProductPage
  profilePage: ProfilePage
  updatedPasswordDialog: UpdatedPasswordDialog
};

export const test = base.extend<POMFixtures>({
  apiOwner: async ({}, use) => {
    const context = await getAuthContext();
    await use(context);
    await context.dispose();
  },
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

  rawMaterialsPage: async ({ page }, use) => {
    await use(new RawMaterialsPage(page));
  },
  newRawMaterialPage: async ({ page }, use) => {
    await use(new NewRawMaterialPage(page));
  },
  editRawMaterialPage: async ({ page }, use) => {
    await use(new EditRawMaterialPage(page));
  },

  packagingMaterialsPage: async ({ page }, use) => {
    await use(new PackagingMaterialsPage(page));
  },
  newPackagingMaterialPage: async ({ page }, use) => {
    await use(new NewPackagingMaterialPage(page));
  },
  editPackagingMaterialPage: async ({ page }, use) => {
    await use(new EditPackagingMaterialPage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  newProductPage: async ({ page }, use) => {
    await use(new NewProductPage(page));
  },
  editProductPage: async ({ page }, use) => {
    await use(new EditProductPage(page));
  },

  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  updatedPasswordDialog: async ({ page }, use) => {
    await use(new UpdatedPasswordDialog(page));
  },
});

export { expect } from '@playwright/test';
