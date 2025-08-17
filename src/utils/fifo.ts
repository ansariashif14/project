import { InventoryBatch, FifoDetail, Product } from '../types';

export class FIFOCalculator {
  static calculateSaleCost(product: Product, saleQuantity: number): { totalCost: number; fifoDetails: FifoDetail[] } {
    const availableBatches = product.batches
      .filter(batch => batch.remainingQuantity > 0)
      .sort((a, b) => a.purchaseDate.getTime() - b.purchaseDate.getTime());

    let remainingToSell = saleQuantity;
    let totalCost = 0;
    const fifoDetails: FifoDetail[] = [];

    for (const batch of availableBatches) {
      if (remainingToSell <= 0) break;

      const quantityFromBatch = Math.min(remainingToSell, batch.remainingQuantity);
      const costFromBatch = quantityFromBatch * batch.unitCost;

      totalCost += costFromBatch;
      remainingToSell -= quantityFromBatch;

      fifoDetails.push({
        batchId: batch.id,
        quantity: quantityFromBatch,
        unitCost: batch.unitCost
      });
    }

    return { totalCost, fifoDetails };
  }

  static updateInventoryAfterSale(product: Product, saleQuantity: number, fifoDetails: FifoDetail[]): Product {
    const updatedBatches = product.batches.map(batch => {
      const fifoDetail = fifoDetails.find(detail => detail.batchId === batch.id);
      if (fifoDetail) {
        return {
          ...batch,
          remainingQuantity: batch.remainingQuantity - fifoDetail.quantity
        };
      }
      return batch;
    });

    const newQuantity = product.currentQuantity - saleQuantity;
    const newTotalCost = updatedBatches.reduce(
      (total, batch) => total + (batch.remainingQuantity * batch.unitCost), 
      0
    );

    return {
      ...product,
      currentQuantity: newQuantity,
      totalCost: newTotalCost,
      averageCost: newQuantity > 0 ? newTotalCost / newQuantity : 0,
      batches: updatedBatches
    };
  }

  static addPurchaseBatch(product: Product, quantity: number, unitCost: number): Product {
    const newBatch: InventoryBatch = {
      id: `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId: product.id,
      quantity,
      unitCost,
      remainingQuantity: quantity,
      purchaseDate: new Date()
    };

    const newQuantity = product.currentQuantity + quantity;
    const newTotalCost = product.totalCost + (quantity * unitCost);

    return {
      ...product,
      currentQuantity: newQuantity,
      totalCost: newTotalCost,
      averageCost: newTotalCost / newQuantity,
      batches: [...product.batches, newBatch]
    };
  }
}