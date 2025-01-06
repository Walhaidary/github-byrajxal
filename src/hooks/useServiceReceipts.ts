import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ServiceReceipt } from '../types/serviceReceipt';
import { ServiceReceiptFilters } from '../components/reports/ServiceReceiptReport';

export function useServiceReceipts(filters: ServiceReceiptFilters) {
  const [receipts, setReceipts] = useState<ServiceReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReceipts = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('service_receipts')
        .select(`
          *,
          service_receipt_items (
            id,
            service_cost,
            number_of_operations,
            number_of_units
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters if any are set
      if (filters.serialNumber) {
        query = query.ilike('serial_number', `%${filters.serialNumber}%`);
      }
      if (filters.startDate) {
        query = query.gte('service_date', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('service_date', filters.endDate);
      }
      if (filters.serviceProviderId) {
        query = query.eq('service_provider_code', filters.serviceProviderId);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.paymentStatus) {
        query = query.eq('payment_status', filters.paymentStatus);
      }

      const { data, error: apiError } = await query;

      if (apiError) throw apiError;
      setReceipts(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching receipts:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch receipts'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  return { receipts, loading, error, refetch: fetchReceipts };
}