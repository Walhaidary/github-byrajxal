import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ServiceProviderSelect } from '../service/ServiceProviderSelect';
import { ServiceReceiptFilters } from './ServiceReceiptReport';

interface FiltersProps {
  filters: ServiceReceiptFilters;
  onFilterChange: (filters: ServiceReceiptFilters) => void;
}

export function ReceiptFilters({ filters, onFilterChange }: FiltersProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleProviderSelect = (name: string, code: string) => {
    onFilterChange({ ...filters, serviceProviderId: code });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search receipts..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            type="date"
            label="Start Date"
            name="startDate"
            value={filters.startDate}
            onChange={handleDateChange}
          />
          <Input
            type="date"
            label="End Date"
            name="endDate"
            value={filters.endDate}
            onChange={handleDateChange}
          />
          <ServiceProviderSelect
            value=""
            onSelect={handleProviderSelect}
          />
          <Select
            label="Status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            options={[
              { value: '', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' }
            ]}
          />
          <Select
            label="Payment Status"
            name="paymentStatus"
            value={filters.paymentStatus}
            onChange={handleChange}
            options={[
              { value: '', label: 'All' },
              { value: 'pending', label: 'Not Paid' },
              { value: 'paid', label: 'Paid' }
            ]}
          />
        </div>
      </div>
    </div>
  );
}