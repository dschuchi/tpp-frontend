import { type Locator, type Page } from '@playwright/test';
import { PurchaseForm } from '../../components/PurchaseForm';

export class NewPurchasePage {
  readonly page: Page;
  readonly purchaseForm: PurchaseForm;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.purchaseForm = new PurchaseForm(page);
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
  }

  async createPurchase(purchase: { 
    scheduled_date: string, 
    received_date: string, 
    observation: string, 
    items: Array<{ type: 'raw' | 'packaging', quantity: number, price: string }> 
  }) {
    await this.purchaseForm.selectSupplier();
    await this.purchaseForm.fillScheduledDate(purchase.scheduled_date);
    await this.purchaseForm.fillReceivedDate(purchase.received_date);
    await this.purchaseForm.fillObservation(purchase.observation);

    for (const item of purchase.items) {
      if (item.type === 'raw') {
        await this.purchaseForm.addRawMaterialItem(item.quantity, item.price);
      } else {
        await this.purchaseForm.addPackagingMaterialItem(item.quantity, item.price);
      }
    }

    await this.saveButton.click();
  }
}
