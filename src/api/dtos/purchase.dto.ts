import type { PurchaseItemCreateDTO, PurchaseItemDTO } from "./purchase-item.dto";

interface PurchaseBaseDTO {
  supplier_id: number;
  status_id: number;
  observation: string | null;
  scheduled_date: string | null;
  received_date: string | null;
}

export interface PurchaseCreateDTO extends PurchaseBaseDTO {
  purchase_items: PurchaseItemCreateDTO[];
}

export interface PurchaseDTO extends PurchaseBaseDTO {
  id: number;
  supplier_name: string;
  status: string;
  observation: string;
  purchase_items: PurchaseItemDTO[];
}

export interface PurchaseListResponseDTO {
  total: number;
  purchases: PurchaseDTO[];
}
