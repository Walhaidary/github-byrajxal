import { differenceInDays } from 'date-fns';

interface ServiceReceiptItem {
  service_cost: number;
  number_of_operations: number;
  number_of_units: number;
}

interface ServiceReceipt {
  id: string;
  status: string;
  payment_status: string;
  service_receipt_items: ServiceReceiptItem[];
  created_at: string;
  approved_at?: string;
  payment_date?: string;
}

export function calculateReceiptTotal(receipt: ServiceReceipt): number {
  return receipt.service_receipt_items.reduce((sum, item) => 
    sum + (item.service_cost * item.number_of_operations * item.number_of_units), 0);
}

export function calculatePaymentMetrics(receipts: ServiceReceipt[]) {
  return receipts.reduce((acc, receipt) => ({
    paid: acc.paid + (receipt.payment_status === 'paid' ? calculateReceiptTotal(receipt) : 0),
    pending: acc.pending + (receipt.payment_status === 'pending' ? calculateReceiptTotal(receipt) : 0)
  }), { paid: 0, pending: 0 });
}

export function calculateReceiptMetrics(receipts: ServiceReceipt[]) {
  const approved = receipts.filter(r => r.status === 'approved');
  const pending = receipts.filter(r => r.status === 'pending');
  const paid = receipts.filter(r => r.payment_status === 'paid');
  const unpaid = receipts.filter(r => r.payment_status === 'pending');

  const totalAmount = receipts.reduce((sum, r) => sum + calculateReceiptTotal(r), 0);

  return {
    approvedReceipts: approved.length,
    approvedAmount: approved.reduce((sum, r) => sum + calculateReceiptTotal(r), 0),
    pendingReceipts: pending.length,
    pendingAmount: pending.reduce((sum, r) => sum + calculateReceiptTotal(r), 0),
    paidAmount: paid.reduce((sum, r) => sum + calculateReceiptTotal(r), 0),
    unpaidAmount: unpaid.reduce((sum, r) => sum + calculateReceiptTotal(r), 0),
    totalReceipts: receipts.length,
    totalAmount,
    averageAmount: receipts.length > 0 ? totalAmount / receipts.length : 0
  };
}

export function calculateDaysDelayed(receipt: ServiceReceipt): number {
  const today = new Date();
  const createdDate = new Date(receipt.created_at);
  
  // For pending approval
  if (receipt.status === 'pending') {
    return differenceInDays(today, createdDate);
  }
  
  // For pending payment
  if (receipt.payment_status === 'pending' && receipt.approved_at) {
    return differenceInDays(today, new Date(receipt.approved_at));
  }
  
  return 0;
}