import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { calculateMonthlyTrends } from '../utils/metrics';

export function useTrends() {
  const [receiptTrends, setReceiptTrends] = useState([]);
  const [leadTimeTrends, setLeadTimeTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrends() {
      try {
        const { data, error } = await supabase
          .from('service_receipts')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        const { monthlyReceipts, monthlyLeadTimes } = calculateMonthlyTrends(data || []);
        setReceiptTrends(monthlyReceipts);
        setLeadTimeTrends(monthlyLeadTimes);
      } catch (error) {
        console.error('Error fetching trends:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrends();
  }, []);

  return { receiptTrends, leadTimeTrends, loading };
}