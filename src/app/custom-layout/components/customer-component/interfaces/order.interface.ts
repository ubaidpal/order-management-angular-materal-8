export interface Order {
  id: number;
  piNumber?: string;
  city?: string,
  orderQty?: number;
  orderRate?: string;
  shipmentDate?: string;
  remaining?: string;
  status?: string;
}
