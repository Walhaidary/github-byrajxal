import { supabase } from './supabase';

interface FlattenedReceiptData {
  // Receipt Details
  receipt_id: string;
  serial_number: string;
  warehouse_number: string;
  service_provider_name: string;
  service_provider_code: string;
  wbs: string;
  service_date: string;
  storekeeper_name: string;
  receipt_total_cost: number;
  status: string;
  created_at: string;
  created_by: string;
  approved_by?: string;
  approved_by_name?: string;
  approved_at?: string;
  // Item Details
  item_id: string;
  service_name: string;
  service_id: string;
  service_cost: number;
  number_of_operations: number;
  number_of_units: number;
  item_total_cost: number;
}

export async function fetchReceiptsForBackup(): Promise<FlattenedReceiptData[]> {
  try {
    // Fetch all receipts
    const { data: receipts, error: receiptsError } = await supabase
      .from('service_receipts')
      .select('*')
      .order('created_at', { ascending: false });

    if (receiptsError) throw receiptsError;

    // Fetch items for all receipts
    const { data: items, error: itemsError } = await supabase
      .from('service_receipt_items')
      .select('*');

    if (itemsError) throw itemsError;

    // Flatten the data structure - one row per service item
    const flattenedData: FlattenedReceiptData[] = [];

    for (const receipt of receipts) {
      const receiptItems = items.filter(item => item.receipt_id === receipt.id);
      
      // If no items found, still include the receipt with empty item fields
      if (receiptItems.length === 0) {
        flattenedData.push({
          // Receipt details
          receipt_id: receipt.id,
          serial_number: receipt.serial_number,
          warehouse_number: receipt.warehouse_number,
          service_provider_name: receipt.service_provider_name,
          service_provider_code: receipt.service_provider_code,
          wbs: receipt.wbs,
          service_date: receipt.service_date,
          storekeeper_name: receipt.storekeeper_name,
          receipt_total_cost: receipt.total_cost,
          status: receipt.status,
          created_at: receipt.created_at,
          created_by: receipt.created_by,
          approved_by: receipt.approved_by,
          approved_by_name: receipt.approved_by_name,
          approved_at: receipt.approved_at,
          // Empty item details
          item_id: '',
          service_name: '',
          service_id: '',
          service_cost: 0,
          number_of_operations: 0,
          number_of_units: 0,
          item_total_cost: 0
        });
      } else {
        // Create a row for each item
        for (const item of receiptItems) {
          flattenedData.push({
            // Receipt details
            receipt_id: receipt.id,
            serial_number: receipt.serial_number,
            warehouse_number: receipt.warehouse_number,
            service_provider_name: receipt.service_provider_name,
            service_provider_code: receipt.service_provider_code,
            wbs: receipt.wbs,
            service_date: receipt.service_date,
            storekeeper_name: receipt.storekeeper_name,
            receipt_total_cost: receipt.total_cost,
            status: receipt.status,
            created_at: receipt.created_at,
            created_by: receipt.created_by,
            approved_by: receipt.approved_by,
            approved_by_name: receipt.approved_by_name,
            approved_at: receipt.approved_at,
            // Item details
            item_id: item.id,
            service_name: item.service_name,
            service_id: item.service_id,
            service_cost: item.service_cost,
            number_of_operations: item.number_of_operations,
            number_of_units: item.number_of_units,
            item_total_cost: item.service_cost * item.number_of_operations * item.number_of_units
          });
        }
      }
    }

    return flattenedData;
  } catch (error) {
    console.error('Error fetching data for backup:', error);
    throw error;
  }
}