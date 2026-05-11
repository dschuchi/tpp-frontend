import type { PurchaseCreateDTO, PurchaseDTO } from "@/api/dtos/purchase.dto";
import type { Purchase } from "@/models/purchase.model";
import { purchaseItemMapper } from '@/mappers/purchase-item.mapper';

export const purchaseMapper = {
  toModel(dto: PurchaseDTO): Purchase {
    return {
      id: dto.id,
      supplierId: dto.supplier_id,
      supplierName: dto.supplier_name,
      statusId: dto.status_id,
      statusName: dto.status,
      observation: dto.observation,
      scheduledDate: dto.scheduled_date ? new Date(dto.scheduled_date) : null,
      receivedDate: dto.received_date ? new Date(dto.received_date) : null,

      items: dto.purchase_items.map(purchaseItemMapper.toModel)
    };
  },
  toCreateDTO(model: Partial<Purchase>): PurchaseCreateDTO {
    const { supplierId, statusId, items } = model
    if (!supplierId || !statusId || !items) throw Error('Error creando DTO')
    return {
      supplier_id: supplierId,
      status_id: statusId,
      observation: model.observation ?? null,
      scheduled_date: model.scheduledDate?.toISOString().split('T')[0] ?? null,
      received_date: model.receivedDate?.toISOString().split('T')[0] ?? null,
      purchase_items: items.map(purchaseItemMapper.toDTO)
    }
  }
};
