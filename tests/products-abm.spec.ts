import { test, expect } from './fixtures/pom';
import { PRODUCTS_ENDPOINTS } from '../src/api/endpoints';

test.describe('ABM Productos', () => {

  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('ev@gmail.com', 'admin');
    await expect(page).toHaveURL('/');
  });

  test('debería crear un nuevo producto exitosamente', async ({ page, productsPage, newProductPage }) => {
    const productToCreate = {
      name: `Product-${Date.now()}`,
      version: '1.0.0',
      observations: `Observations ${Date.now()}`
    };

    await productsPage.goto();
    await productsPage.gotoNewProduct();
    await newProductPage.createProduct(productToCreate);

    await expect(page).toHaveURL('/products');
    await productsPage.verifyProductVisible(productToCreate.name);
  });

  test('debería editar un producto existente', async ({ apiOwner, productsPage, editProductPage }) => {
    const productToEdit = {
      name: `ProdEdit-${Date.now()}`,
      version: '1.0.0',
      customer_id: 1
    };

    await apiOwner.post(PRODUCTS_ENDPOINTS.PRODUCT, { data: productToEdit });

    const newVersion = '1.0.1';

    await productsPage.goto();
    await productsPage.gotoEditProduct(productToEdit.name);
    await editProductPage.updateProduct({ version: newVersion });
    await productsPage.verifyProductVisible(productToEdit.name);
  });

  test('debería cambiar el estado de un producto', async ({ apiOwner, productsPage }) => {
    const productToToggle = {
      name: `ProdToggle-${Date.now()}`,
      version: '1.0.0',
      customer_id: 1
    };

    await apiOwner.post(PRODUCTS_ENDPOINTS.PRODUCT, { data: productToToggle });

    await productsPage.goto();
    await productsPage.deleteProduct(productToToggle.name);
    await productsPage.restoreProduct(productToToggle.name);
  });

});
