import { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { supabase } from '../lib/supabase';
import { calculateReceiptMetrics } from '../utils/metrics';

export function useMetrics(month?: string) {
  const [metrics, setMetrics] = useState({
    totalReceipts: 0,
    totalAmount: 0,
    approvedReceipts: 0,
    approvedAmount: 0,
    pendingReceipts: 0,
    pendingAmount: 0,
    paidAmount: 0,
    unpaidAmount: 0,
    averageAmount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
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
          `);

        // Apply date filter if month is selected
        if (month) {
          const startDate = startOfMonth(parseISO(month));
          const endDate = endOfMonth(parseISO(month));
          
          query = query
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());
        }

        const { data, error } = await query;

        if (error) throw error;
        setMetrics(calculateReceiptMetrics(data || []));
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, [month]);

  return { metrics, loading };
}