import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { ServiceReceipt } from '../../types/serviceReceipt';
import { formatNumber } from '../../utils/formatters';
import { ReceiptActions } from './ReceiptActions';

interface ListProps {
  receipts: ServiceReceipt[];
  loading: boolean;
  error: Error | null;
  onReceiptsUpdated: () => void;
}

export function ServiceReceiptList({ receipts, loading, error, onReceiptsUpdated }: ListProps) {
  const navigate = useNavigate();
  const [selectedForApproval, setSelectedForApproval] = useState<string[]>([]);
  const [selectedForPayment, setSelectedForPayment] = useState<string[]>([]);

  const handleSelectForApproval = (id: string, checked: boolean) => {
    setSelectedForApproval(prev => 
      checked ? [...prev, id] : prev.filter(receiptId => receiptId !== id)
    );
  };

  const handleSelectForPayment = (id: string, checked: boolean) => {
    setSelectedForPayment(prev => 
      checked ? [...prev, id] : prev.filter(receiptId => receiptId !== id)
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-red-600">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Provider
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {receipts.map((receipt) => {
                const isApproved = receipt.status === 'approved';
                const isPaid = receipt.payment_status === 'paid';
                return (
                  <tr key={receipt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedForApproval.includes(receipt.id)}
                          onChange={(e) => handleSelectForApproval(receipt.id, e.target.checked)}
                          disabled={isApproved}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <input
                          type="checkbox"
                          checked={selectedForPayment.includes(receipt.id)}
                          onChange={(e) => handleSelectForPayment(receipt.id, e.target.checked)}
                          disabled={!isApproved || isPaid}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {receipt.serial_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {receipt.service_provider_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {receipt.warehouse_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(receipt.service_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {receipt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {receipt.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      {formatNumber(receipt.helper_field)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/dashboard/receipt/${receipt.id}`)}
                        className="flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ReceiptActions
        selectedForApproval={selectedForApproval}
        selectedForPayment={selectedForPayment}
        onApprovalChange={handleSelectForApproval}
        onPaymentChange={handleSelectForPayment}
        onReceiptsUpdated={() => {
          setSelectedForApproval([]);
          setSelectedForPayment([]);
          onReceiptsUpdated();
        }}
      />
    </div>
  );
}