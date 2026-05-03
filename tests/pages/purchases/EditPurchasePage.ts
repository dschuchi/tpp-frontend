import { type Locator, type Page } from '@playwright/test';
import { PurchaseForm } from '../../components/PurchaseForm';

export class EditPurchasePage {
  readonly page: Page;
  readonly purchaseForm: PurchaseForm;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.purchaseForm = new PurchaseForm(page);
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
  }

  async updatePurchase(purchase: { observation?: string, addItems?: Array<{ type: 'raw' | 'packaging', quantity: number, price: string }> }) {
    if (purchase.observation) {
      await this.purchaseForm.fillObservation(purchase.observation);
    }
    
    if (purchase.addItems) {
      for (const item of purchase.addItems) {
        if (item.type === 'raw') {
          await this.purchaseForm.addRawMaterialItem(item.quantity, item.price);
        } else {
          await this.purchaseForm.addPackagingMaterialItem(item.quantity, item.price);
        }
      }
    }
    
    await this.saveButton.click();
  }
}
