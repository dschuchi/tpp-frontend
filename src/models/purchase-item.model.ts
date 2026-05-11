export interface PurchaseItem {
  id: number;

  rawMaterialId: number | null;
  packagingMaterialId: number | null;
  materialName: string;
  materialType: 'raw_material' | 'packaging_material';

  unitPrice: number;
  quantity: number;
}
