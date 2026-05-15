interface PurchaseItemBaseDTO {
  raw_material_id: number | null;
  packaging_material_id: number | null;
  unit_price: string;
  quantity: number;
}

export interface PurchaseItemCreateDTO extends PurchaseItemBaseDTO { }

export interface PurchaseItemUpdateDTO extends PurchaseItemBaseDTO {
  id: number;
}

export interface PurchaseItemDTO extends PurchaseItemBaseDTO {
  id: number;
  raw_material_name: string | null;
  packaging_material_code: string | null;
  packaging_material_description: string | null;
}
