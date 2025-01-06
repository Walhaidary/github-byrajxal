import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { formatNumber } from '../../utils/formatters';
import { calculatePaymentMetrics } from '../../utils/metrics';

export function PaymentStatus() {
  const [data, setData] = useState({
    paid: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: receipts, error } = await supabase
          .from('service_receipts')
          .select('*, service_receipt_items(*)')
          .in('payment_status', ['paid', 'pending']);

        if (error) throw error;

        setData(calculatePaymentMetrics(receipts || []));
      } catch (error) {
        console.error('Error fetching payment data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-96 animate-pulse" />
    );
  }

  const total = data.paid + data.pending;
  const paidPercentage = total > 0 ? (data.paid / total) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-facebook-text mb-6">Payment Status</h3>
      
      <div className="space-y-6">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-100 text-green-600">
                Paid
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-green-600">
                {paidPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100">
            <div
              style={{ width: `${paidPercentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Paid Amount</p>
            <p className="text-xl font-semibold text-green-700 mt-1">
              {formatNumber(data.paid)}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-yellow-600 font-medium">Pending Amount</p>
            <p className="text-xl font-semibold text-yellow-700 mt-1">
              {formatNumber(data.pending)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}