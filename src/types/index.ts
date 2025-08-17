export interface User {
  id: string;
  password: string;
}

export interface Product {
  id: string;
  name: string;
  currentQuantity: number;
  totalCost?: number | null;
  averageCost?: number | null;
}


export interface InventoryBatch {
  id: string;
  productId: string;
  quantity: number;
  unitCost: number;
  remainingQuantity: number;
  purchaseDate: Date;
}

export interface Transaction {
  id: string;
  productId: string;
  type: 'purchase' | 'sale';
  quantity: number;
  unitPrice?: number | null;
  totalCost?: number | null;
  date: string | Date;
}

export interface FifoDetail {
  batchId: string;
  quantity: number;
  unitCost: number;
}