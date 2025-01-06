import React from 'react';
import { useForm } from '../../hooks/useForm';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { ServiceProviderSelect } from '../service/ServiceProviderSelect';
import { supabase } from '../../lib/supabase';
import { Info } from 'lucide-react';

interface ServiceForm {
  name: string;
  description: string;
  price: number;
  category: string;
  providerId: string;
  providerName: string;
}

const initialValues: ServiceForm = {
  name: '',
  description: '',
  price: 0,
  category: '',
  providerId: '',
  providerName: ''
};

export default function ServiceConfiguration() {
  const { values, errors, handleChange, handleSubmit, setValues } = useForm<ServiceForm>({
    initialValues,
    onSubmit: async (values) => {
      try {
        const { error: serviceError } = await supabase
          .from('services')
          .insert([{
            name: values.name,
            description: values.description || null,
            price: values.price,
            category: values.category || null,
            provider_id: values.providerId,
            provider_name: values.providerName
          }]);

        if (serviceError) throw serviceError;

        setValues(initialValues);
        alert('Service added successfully!');
      } catch (error: any) {
        console.error('Error adding service:', error);
        alert(error.message || 'Error adding service. Please try again.');
      }
    },
    validate: (values) => {
      const errors: Partial<ServiceForm> = {};
      if (!values.name.trim()) {
        errors.name = 'Service name is required';
      }
      if (!values.providerId) {
        errors.providerId = 'Service provider is required';
      }
      if (!values.price || values.price <= 0) {
        errors.price = 'Price must be greater than 0';
      }
      return errors;
    },
  });

  const handleProviderSelect = (name: string, id: string) => {
    setValues(prev => ({
      ...prev,
      providerId: id,
      providerName: name
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blue Header */}
      <div className="bg-blue-600 text-white py-6 px-4 sm:px-6 lg:px-8 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Service Configuration</h1>
          <p className="mt-1 text-blue-100">Add and manage available services</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Info Box */}
          <div className="p-6 border-b border-gray-200 bg-blue-50">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Important Information
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>All services must have a valid name, provider, and price.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Add Service Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            <div className="space-y-8 divide-y divide-gray-200">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Service Details
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Provide the details of the service you want to add.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input
                    label="Service Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                  />

                  <Input
                    label="Category"
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                  />

                  <ServiceProviderSelect
                    value={values.providerName}
                    onSelect={handleProviderSelect}
                    error={errors.providerId}
                  />

                  <Input
                    label="Price"
                    type="number"
                    name="price"
                    value={values.price}
                    onChange={handleChange}
                    error={errors.price}
                    required
                    min="0"
                    step="0.01"
                  />

                  <div className="sm:col-span-2">
                    <Textarea
                      label="Description"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-gray-200">
              <div className="flex justify-end">
                <Button type="submit" className="ml-3">
                  Add Service
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}