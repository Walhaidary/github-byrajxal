import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, DollarSign, CreditCard, AlertTriangle, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatNumber } from '../../utils/formatters';
import { calculateReceiptMetrics } from '../../utils/metrics';

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState({
    approvedReceipts: 0,
    approvedAmount: 0,
    pendingReceipts: 0,
    pendingAmount: 0,
    paidAmount: 0,
    unpaidAmount: 0,
    totalReceipts: 0,
    totalAmount: 0,
    averageAmount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const { data: receipts, error } = await supabase
          .from('service_receipts')
          .select('*, service_receipt_items(*)');

        if (error) throw error;

        setMetrics(calculateReceiptMetrics(receipts || []));
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  // Rest of the component remains the same...
}