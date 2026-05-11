import type { PurchaseItem } from "./purchase-item.model";

export interface Purchase {
  id: number;
  supplierId: number;
  supplierName: string;
  statusId: number;
  statusName: string;
  observation: string;

  scheduledDate: Date | null;
  receivedDate: Date | null;

  items: PurchaseItem[];
}
