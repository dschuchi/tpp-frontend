import { test, expect } from './fixtures/pom';

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

  test('debería editar un producto existente', async ({ page, productsPage, newProductPage, editProductPage }) => {
    const productToEdit = {
      name: `ProdEdit-${Date.now()}`,
      version: '1.0.0'
    };

    await productsPage.goto();
    await productsPage.gotoNewProduct();
    await newProductPage.createProduct(productToEdit);
    await expect(page).toHaveURL('/products');
    await productsPage.verifyProductVisible(productToEdit.name);

    const newVersion = '1.0.1';

    await productsPage.gotoEditProduct(productToEdit.name);
    await editProductPage.updateProduct({ version: newVersion });

    await expect(page).toHaveURL('/products');
    await productsPage.verifyProductVisible(productToEdit.name);
  });

  test('debería cambiar el estado de un producto', async ({ page, productsPage, newProductPage }) => {
    const productToToggle = {
      name: `ProdToggle-${Date.now()}`,
      version: '1.0.0'
    };

    await productsPage.goto();
    await productsPage.gotoNewProduct();
    await newProductPage.createProduct(productToToggle);
    await expect(page).toHaveURL('/products');
    await productsPage.verifyProductVisible(productToToggle.name);

    await productsPage.deleteProduct(productToToggle.name);

    await productsPage.restoreProduct(productToToggle.name);
  });

});
