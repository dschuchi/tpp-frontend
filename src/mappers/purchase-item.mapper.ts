
import type { PurchaseItemDTO, PurchaseItemCreateDTO } from "@/api/dtos/purchase-item.dto";
import type { PurchaseItem } from "@/models/purchase-item.model";

export const purchaseItemMapper = {
  toModel(dto: PurchaseItemDTO): PurchaseItem {
    const materialType = dto.raw_material_id ? 'raw_material' : 'packaging_material';
    return {
      id: dto.id,
      rawMaterialId: dto.raw_material_id,
      packagingMaterialId: dto.packaging_material_id,
      materialName: dto.raw_material_name || dto.packaging_material_description || 'Sin descripción',
      materialType,
      unitPrice: parseFloat(dto.unit_price) || 0,
      quantity: dto.quantity
    };
  },
  toDTO(model: PurchaseItem): PurchaseItemCreateDTO {
    return {
      raw_material_id: model.rawMaterialId,
      packaging_material_id: model.packagingMaterialId,
      unit_price: model.unitPrice.toString(),
      quantity: model.quantity,
    };
  }
};
