import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { calculateDaysDelayed } from '../utils/metrics';

interface DelayedReceipt {
  id: string;
  serial_number: string;
  status: string;
  created_at: string;
  approved_at?: string;
  days_delayed: number;
}

export function useDelayedReceipts() {
  const [receipts, setReceipts] = useState<DelayedReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchDelayedReceipts() {
      try {
        const { data, error: fetchError } = await supabase
          .from('service_receipts')
          .select('*')
          .or('status.eq.pending,payment_status.eq.pending')
          .order('created_at', { ascending: true })
          .limit(5);

        if (fetchError) throw fetchError;

        const delayedReceipts = (data || []).map(receipt => ({
          ...receipt,
          days_delayed: calculateDaysDelayed(receipt)
        }));

        setReceipts(delayedReceipts);
        setError(null);
      } catch (err) {
        console.error('Error fetching delayed receipts:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch delayed receipts'));
      } finally {
        setLoading(false);
      }
    }

    fetchDelayedReceipts();
  }, []);

  return { receipts, loading, error };
}