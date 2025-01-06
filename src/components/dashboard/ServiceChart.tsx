import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { format, subDays } from 'date-fns';
import { calculateReceiptTotal } from '../../utils/metrics';

export function ServiceChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const endDate = new Date();
        const startDate = subDays(endDate, 7);

        const { data: receipts, error } = await supabase
          .from('service_receipts')
          .select('*, service_receipt_items(*)')
          .gte('service_date', startDate.toISOString())
          .lte('service_date', endDate.toISOString())
          .order('service_date');

        if (error) throw error;

        // Group by date and sum total costs
        const grouped = receipts?.reduce((acc, receipt) => {
          const date = format(new Date(receipt.service_date), 'MMM d');
          acc[date] = (acc[date] || 0) + calculateReceiptTotal(receipt);
          return acc;
        }, {});

        setData(Object.entries(grouped || {}).map(([date, value]) => ({
          date,
          value
        })));
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Rest of the component remains the same...
}