import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { ServiceSelect } from './ServiceSelect';
import { formatNumber } from '../../utils/formatters';

interface ServiceItem {
  id: string;
  serviceName: string;
  serviceId: string;
  serviceCost: number;
  numberOfOperations: number;
  numberOfUnits: number;
}

interface ServiceReceiptTableProps {
  items: ServiceItem[];
  providerId: string | null;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, field: keyof ServiceItem, value: string | number) => void;
  readOnly?: boolean;
}

export function ServiceReceiptTable({ 
  items = [], 
  providerId,
  onAddItem, 
  onRemoveItem, 
  onUpdateItem,
  readOnly = false
}: ServiceReceiptTableProps) {
  const handleServiceSelect = (id: string, serviceName: string, serviceId: string, price: number) => {
    onUpdateItem(id, 'serviceName', serviceName);
    onUpdateItem(id, 'serviceId', serviceId);
    onUpdateItem(id, 'serviceCost', price);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
    field: keyof ServiceItem
  ) => {
    const value = e.target.type === 'number' 
      ? (parseFloat(e.target.value) || 0)
      : e.target.value;
    onUpdateItem(id, field, value);
  };

  const calculateTotalCost = (item: ServiceItem): number => {
    return item.serviceCost * item.numberOfOperations * item.numberOfUnits;
  };

  const totalAmount = items.reduce((sum, item) => sum + calculateTotalCost(item), 0);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service Cost
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operations
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Units
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Cost
              </th>
              {!readOnly && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {readOnly ? (
                    <div className="text-sm text-gray-900">{item.serviceName}</div>
                  ) : (
                    <ServiceSelect
                      value={item.serviceName}
                      providerId={providerId}
                      onSelect={(name, id, price) => handleServiceSelect(item.id, name, id, price)}
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.serviceId || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatNumber(item.serviceCost)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {readOnly ? (
                    <div className="text-sm text-gray-900">{item.numberOfOperations}</div>
                  ) : (
                    <input
                      type="number"
                      min="1"
                      className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={item.numberOfOperations}
                      onChange={(e) => handleInputChange(e, item.id, 'numberOfOperations')}
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {readOnly ? (
                    <div className="text-sm text-gray-900">{item.numberOfUnits}</div>
                  ) : (
                    <input
                      type="number"
                      min="1"
                      className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={item.numberOfUnits}
                      onChange={(e) => handleInputChange(e, item.id, 'numberOfUnits')}
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatNumber(calculateTotalCost(item))}
                </td>
                {!readOnly && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={5} className="px-6 py-4 text-sm font-medium text-gray-900">
                Total Amount
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatNumber(totalAmount)}
              </td>
              {!readOnly && <td />}
            </tr>
          </tfoot>
        </table>
      </div>

      {!readOnly && (
        <div className="mt-4">
          <Button
            type="button"
            onClick={onAddItem}
            className="flex items-center"
            variant="secondary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      )}
    </div>
  );
}