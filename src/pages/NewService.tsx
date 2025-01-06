import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ServiceReceiptHeader } from '../components/service/ServiceReceiptHeader';
import { ServiceReceiptTable } from '../components/service/ServiceReceiptTable';
import { InfoBox } from '../components/service/InfoBox';
import { Button } from '../components/ui/Button';
import { generateSerialNumber } from '../utils/serialNumber';
import { saveServiceReceipt } from '../lib/serviceReceipts';
import { calculateTotalAmount } from '../utils/calculations';

interface ServiceItem {
  id: string;
  serviceName: string;
  serviceId: string;
  serviceCost: number;
  numberOfOperations: number;
  numberOfUnits: number;
}

interface HeaderData {
  serialNumber: string;
  warehouseNumber: string;
  serviceProviderName: string;
  serviceProviderCode: string;
  wbs: string;
  serviceDate: string;
  storekeeperName: string;
}

const getInitialHeaderData = (): HeaderData => ({
  serialNumber: generateSerialNumber(),
  warehouseNumber: '',
  serviceProviderName: '',
  serviceProviderCode: '',
  wbs: '',
  serviceDate: '',
  storekeeperName: ''
});

export default function NewService() {
  const navigate = useNavigate();
  const [headerData, setHeaderData] = useState(getInitialHeaderData());
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [saving, setSaving] = useState(false);

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHeaderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceProviderSelect = (name: string, code: string) => {
    setHeaderData(prev => ({
      ...prev,
      serviceProviderName: name,
      serviceProviderCode: code
    }));
    // Clear service items when provider changes
    setServiceItems([]);
  };

  const handleAddItem = () => {
    const newItem: ServiceItem = {
      id: uuidv4(),
      serviceName: '',
      serviceId: '',
      serviceCost: 0,
      numberOfOperations: 1,
      numberOfUnits: 1
    };
    setServiceItems(prev => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setServiceItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof ServiceItem, value: string | number) => {
    setServiceItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const resetForm = () => {
    setHeaderData(getInitialHeaderData());
    setServiceItems([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceItems.length === 0) {
      alert('Please add at least one service item');
      return;
    }

    setSaving(true);

    try {
      const result = await saveServiceReceipt(headerData, serviceItems);
      
      if (!result.success) {
        throw result.error;
      }

      alert('Service receipt saved successfully!');
      resetForm();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error saving service receipt:', error);
      alert('Failed to save service receipt. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Extract provider ID from the code
  const providerId = headerData.serviceProviderCode || null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-6 px-4 sm:px-6 lg:px-8 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">New Service Request</h1>
          <p className="mt-1 text-blue-100">Create a new service receipt request</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <InfoBox />

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-8 divide-y divide-gray-200">
              <div className="space-y-6 pt-8">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Service Details
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Please provide the basic information about the service request.
                  </p>
                </div>

                <ServiceReceiptHeader
                  formData={headerData}
                  onChange={handleHeaderChange}
                  onServiceProviderSelect={handleServiceProviderSelect}
                />
              </div>

              <div className="space-y-6 pt-8">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Service Items
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add one or more services to this request.
                  </p>
                </div>

                <ServiceReceiptTable
                  items={serviceItems}
                  providerId={providerId}
                  onAddItem={handleAddItem}
                  onRemoveItem={handleRemoveItem}
                  onUpdateItem={handleUpdateItem}
                />
              </div>
            </div>

            <div className="pt-5 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/dashboard')}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving || serviceItems.length === 0}
                >
                  {saving ? 'Saving...' : 'Submit Request'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}