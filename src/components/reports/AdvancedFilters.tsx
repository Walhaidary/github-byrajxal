import React from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { ServiceReceiptFilters } from './ServiceReceiptReport';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ServiceProviderSelect } from '../service/ServiceProviderSelect';
import { Button } from '../ui/Button';

interface AdvancedFiltersProps {
  isOpen: boolean;
  filters: ServiceReceiptFilters;
  onFilterChange: (filters: ServiceReceiptFilters) => void;
  onToggle: () => void;
}

export function AdvancedFilters({ 
  isOpen, 
  filters, 
  onFilterChange,
  onToggle 
}: AdvancedFiltersProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleProviderSelect = (name: string, id: string) => {
    onFilterChange({ 
      ...filters, 
      serviceProviderId: id,
      serviceProviderName: name 
    });
  };

  return (
    <div className="space-y-4">
      <Button
        variant="secondary"
        onClick={onToggle}
        className="flex items-center bg-[#42b72a] hover:bg-[#36a420] text-white"
      >
        <Filter className="h-4 w-4 mr-2" />
        Advanced Filters
        {isOpen ? (
          <ChevronUp className="h-4 w-4 ml-2" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-2" />
        )}
      </Button>

      {isOpen && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Serial Number"
              name="serialNumber"
              value={filters.serialNumber}
              onChange={handleChange}
              placeholder="Enter serial number"
            />
            <Input
              type="date"
              label="Start Date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
            />
            <Input
              type="date"
              label="End Date"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
            />
            <ServiceProviderSelect
              value={filters.serviceProviderName}
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
      )}
    </div>
  );
}