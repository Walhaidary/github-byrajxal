interface ServiceItem {
  serviceCost: number;
  numberOfOperations: number;
  numberOfUnits: number;
}

export function calculateTotalAmount(items: ServiceItem[]): number {
  return items.reduce((total, item) => {
    return total + (item.serviceCost * item.numberOfOperations * item.numberOfUnits);
  }, 0);
}