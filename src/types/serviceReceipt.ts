export interface ServiceReceipt {
  id: string;
  serial_number: string;
  warehouse_number: string;
  service_provider_name: string;
  service_provider_code: string;
  wbs: string;
  service_date: string;
  storekeeper_name: string;
  helper_field: number;
  status: 'pending' | 'approved' | 'rejected';
  payment_status: 'pending' | 'paid';
  payment_date?: string;
  paid_by?: string;
  created_at: string;
  created_by: string;
  approved_by?: string;
  approved_by_name?: string;
  approved_at?: string;
}