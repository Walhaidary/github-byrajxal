import { supabase } from './supabase';
import { calculateTotalAmount } from '../utils/calculations';

export interface ServiceReceiptHeader {
  serialNumber: string;
  warehouseNumber: string;
  serviceProviderName: string;
  serviceProviderCode: string;
  wbs: string;
  serviceDate: string;
  storekeeperName: string;
}

export interface ServiceItem {
  id: string;
  serviceName: string;
  serviceId: string;
  serviceCost: number;
  numberOfOperations: number;
  numberOfUnits: number;
}

export interface SaveResult {
  success: boolean;
  error?: Error;
  receiptId?: string;
}

export async function saveServiceReceipt(
  header: ServiceReceiptHeader,
  items: ServiceItem[]
): Promise<SaveResult> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    // Calculate total from items
    const totalAmount = calculateTotalAmount(items);

    // Insert the receipt
    const { data: receipt, error: receiptError } = await supabase
      .from('service_receipts')
      .insert([{
        serial_number: header.serialNumber,
        warehouse_number: header.warehouseNumber,
        service_provider_name: header.serviceProviderName,
        service_provider_code: header.serviceProviderCode,
        wbs: header.wbs,
        service_date: header.serviceDate,
        storekeeper_name: header.storekeeperName,
        helper_field: totalAmount,
        status: 'pending',
        payment_status: 'pending',
        created_by: user.id
      }])
      .select()
      .single();

    if (receiptError) throw receiptError;
    if (!receipt) throw new Error('Failed to create receipt');

    // Insert receipt items with total_cost
    const { error: itemsError } = await supabase
      .from('service_receipt_items')
      .insert(
        items.map(item => ({
          receipt_id: receipt.id,
          service_id: item.serviceId,
          service_name: item.serviceName,
          service_cost: item.serviceCost,
          number_of_operations: item.numberOfOperations,
          number_of_units: item.numberOfUnits,
          total_cost: item.serviceCost * item.numberOfOperations * item.numberOfUnits
        }))
      );

    if (itemsError) throw itemsError;

    return { 
      success: true,
      receiptId: receipt.id
    };
  } catch (error) {
    console.error('Error saving service receipt:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to save service receipt')
    };
  }
}

export async function approveServiceReceipts(receiptIds: string[]): Promise<SaveResult> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    const { error: updateError } = await supabase
      .from('service_receipts')
      .update({
        status: 'approved',
        approved_by: user.id,
        approved_by_name: user.email,
        approved_at: new Date().toISOString()
      })
      .in('id', receiptIds);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error('Error approving receipts:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to approve receipts')
    };
  }
}

export async function updatePaymentStatus(receiptIds: string[]): Promise<SaveResult> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    const { error: updateError } = await supabase
      .from('service_receipts')
      .update({
        payment_status: 'paid',
        paid_by: user.id,
        payment_date: new Date().toISOString()
      })
      .in('id', receiptIds);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error('Error updating payment status:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to update payment status')
    };
  }
}

export async function reverseApproval(receiptIds: string[]): Promise<SaveResult> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    const { error: updateError } = await supabase
      .from('service_receipts')
      .update({
        status: 'pending',
        approved_by: null,
        approved_by_name: null,
        approved_at: null
      })
      .in('id', receiptIds);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error('Error reversing approval:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to reverse approval')
    };
  }
}

export async function reversePaymentStatus(receiptIds: string[]): Promise<SaveResult> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    const { error: updateError } = await supabase
      .from('service_receipts')
      .update({
        payment_status: 'pending',
        paid_by: null,
        payment_date: null
      })
      .in('id', receiptIds);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error('Error reversing payment status:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to reverse payment status')
    };
  }
}