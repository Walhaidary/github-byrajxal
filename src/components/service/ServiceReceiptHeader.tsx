import React from 'react';
import { Input } from '../ui/Input';
import { ServiceProviderSelect } from './ServiceProviderSelect';

interface ServiceReceiptHeaderProps {
  formData: {
    serialNumber: string;
    warehouseNumber: string;
    serviceProviderName: string;
    serviceProviderCode: string;
    wbs: string;
    serviceDate: string;
    storekeeperName: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onServiceProviderSelect: (name: string, code: string) => void;
  readOnly?: boolean;
}

export function ServiceReceiptHeader({ 
  formData, 
  onChange,
  onServiceProviderSelect,
  readOnly = false
}: ServiceReceiptHeaderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Form Serial Number
        </label>
        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
          {formData.serialNumber}
        </div>
      </div>
      <Input
        label="Warehouse Number"
        name="warehouseNumber"
        value={formData.warehouseNumber}
        onChange={onChange}
        required
      />
      <ServiceProviderSelect
        value={formData.serviceProviderName}
        onSelect={onServiceProviderSelect}
      />
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Service Provider Code
        </label>
        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
          {formData.serviceProviderCode}
        </div>
      </div>
      <Input
        label="WBS"
        name="wbs"
        value={formData.wbs}
        onChange={onChange}
        required
      />
      <Input
        label="Service Date"
        name="serviceDate"
        type="date"
        value={formData.serviceDate}
        onChange={onChange}
        required
      />
      <Input
        label="Storekeeper Name"
        name="storekeeperName"
        value={formData.storekeeperName}
        onChange={onChange}
        required
      />
    </div>
  );
}