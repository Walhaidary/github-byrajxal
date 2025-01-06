import React from 'react';
import { format } from 'date-fns';
import { formatNumber } from '../../utils/formatters';

interface ServiceItem {
  id: string;
  serviceName: string;
  serviceCost: number;
  numberOfOperations: number;
  numberOfUnits: number;
}

interface PrintableServiceReceiptProps {
  headerData: {
    serialNumber: string;
    warehouseNumber: string;
    serviceProviderName: string;
    serviceProviderCode: string;
    wbs: string;
    serviceDate: string;
    storekeeperName: string;
  };
  items: ServiceItem[];
  approvedBy?: string;
  approvedAt?: string;
}

export function PrintableServiceReceipt({ 
  headerData, 
  items,
  approvedBy,
  approvedAt
}: PrintableServiceReceiptProps) {
  const totalAmount = items.reduce((sum, item) => 
    sum + (item.serviceCost * item.numberOfOperations * item.numberOfUnits), 0
  );

  return (
    <div className="hidden print:block print:p-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-2">Warehouse Handling Service Receipt</h1>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Serial Number:</strong> {headerData.serialNumber}</p>
            <p><strong>Warehouse Number:</strong> {headerData.warehouseNumber}</p>
            <p><strong>WBS:</strong> {headerData.wbs}</p>
            <p><strong>Service Date:</strong> {format(new Date(headerData.serviceDate), 'MMM d, yyyy')}</p>
            <p><strong>Storekeeper:</strong> {headerData.storekeeperName}</p>
          </div>
          <div className="border-l border-gray-200 pl-4">
            <h3 className="font-bold mb-1">Service Provider Details</h3>
            <p><strong>Name:</strong> {headerData.serviceProviderName}</p>
            <p><strong>Code:</strong> {headerData.serviceProviderCode}</p>
          </div>
        </div>
      </div>

      <table className="w-full mb-4">
        <thead>
          <tr className="border-t border-b border-gray-200">
            <th className="py-1 text-left">Service Name</th>
            <th className="py-1 text-right">Cost</th>
            <th className="py-1 text-right">Operations</th>
            <th className="py-1 text-right">Units</th>
            <th className="py-1 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const itemTotal = item.serviceCost * item.numberOfOperations * item.numberOfUnits;
            return (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-1">{item.serviceName}</td>
                <td className="py-1 text-right">{formatNumber(item.serviceCost)}</td>
                <td className="py-1 text-right">{item.numberOfOperations}</td>
                <td className="py-1 text-right">{item.numberOfUnits}</td>
                <td className="py-1 text-right">{formatNumber(itemTotal)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-b border-gray-200 font-semibold">
            <td colSpan={4} className="py-1">Total Amount</td>
            <td className="py-1 text-right">{formatNumber(totalAmount)}</td>
          </tr>
        </tfoot>
      </table>

      {approvedBy && approvedAt && (
        <div className="text-sm mb-8">
          <p><strong>Approved by:</strong> {approvedBy}</p>
          <p><strong>Approved on:</strong> {format(new Date(approvedAt), 'MMM d, yyyy HH:mm')}</p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="text-center">
          <div className="border-t border-gray-300 pt-2">
            <p className="font-medium">Storekeeper Signature</p>
            <p className="text-sm text-gray-600">{headerData.storekeeperName}</p>
            <p className="text-sm text-gray-600">Date: ________________</p>
          </div>
        </div>
        {approvedBy && (
          <div className="text-center">
            <div className="border-t border-gray-300 pt-2">
              <p className="font-medium">Approved By</p>
              <p className="text-sm text-gray-600">{approvedBy}</p>
              <p className="text-sm text-gray-600">Date: ________________</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}