import React from 'react';
import { FileText, CheckCircle, CreditCard, Clock } from 'lucide-react';
import { useMetrics } from '../../hooks/useMetrics';
import { formatNumber } from '../../utils/formatters';

interface MetricsGridProps {
  selectedMonth: string;
}

export function MetricsGrid({ selectedMonth }: MetricsGridProps) {
  const { metrics, loading } = useMetrics(selectedMonth);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Receipts',
      value: metrics.totalReceipts,
      amount: formatNumber(metrics.totalAmount),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Approved Receipts',
      value: metrics.approvedReceipts,
      amount: formatNumber(metrics.approvedAmount),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Paid Amount',
      value: formatNumber(metrics.paidAmount),
      subtitle: 'Total paid receipts',
      icon: CreditCard,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Pending Approval',
      value: metrics.pendingReceipts,
      amount: formatNumber(metrics.pendingAmount),
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className={`${card.bgColor} rounded-lg p-3`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              {card.amount && (
                <p className="text-sm text-gray-500">{card.amount}</p>
              )}
              {card.subtitle && (
                <p className="text-sm text-gray-500">{card.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}