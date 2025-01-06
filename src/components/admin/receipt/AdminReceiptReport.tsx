import React, { useState, useCallback } from 'react';
import { Printer } from 'lucide-react';
import { useServiceReceipts } from '../../../hooks/useServiceReceipts';
import { AdvancedFilters } from '../../reports/AdvancedFilters';
import { AdminReceiptList } from './AdminReceiptList';
import { PrintableReport } from '../../reports/PrintableReport';
import { Button } from '../../ui/Button';
import { ServiceReceiptFilters } from '../../reports/ServiceReceiptReport';

export function AdminReceiptReport() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ServiceReceiptFilters>({
    startDate: '',
    endDate: '',
    serviceProviderId: '',
    status: '',
    paymentStatus: '',
    serialNumber: ''
  });

  const { receipts, loading, error, refetch } = useServiceReceipts(filters);

  const handleReceiptsUpdated = useCallback(() => {
    refetch();
  }, [refetch]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blue Header */}
      <div className="bg-blue-600 text-white py-6 px-4 sm:px-6 lg:px-8 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Admin Receipt Control</h1>
          <p className="mt-1 text-blue-100">Manage all service receipts with full control</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="print:!hidden space-y-6">
          {/* Actions Bar */}
          <div className="flex justify-between items-center">
            <AdvancedFilters
              isOpen={isFiltersOpen}
              filters={filters}
              onFilterChange={setFilters}
              onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
            />
            <Button
              onClick={handlePrint}
              className="flex items-center"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Report
            </Button>
          </div>

          {/* List */}
          <AdminReceiptList
            receipts={receipts || []}
            loading={loading}
            error={error}
            onReceiptsUpdated={handleReceiptsUpdated}
          />
        </div>

        {/* Printable Version */}
        <div className="hidden print:!block print:!m-0 print:!p-0">
          <PrintableReport 
            receipts={receipts || []}
            filters={filters}
          />
        </div>
      </div>
    </div>
  );
}