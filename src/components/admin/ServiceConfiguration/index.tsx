import React from 'react';
import { useForm } from '../../../hooks/useForm';
import { Info } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { ServiceForm } from './ServiceForm';
import { ServiceFormData } from './types';

const initialValues: ServiceFormData = {
  name: '',
  description: '',
  price: 0,
  category: '',
  providerId: '',
  providerName: ''
};

export default function ServiceConfiguration() {
  const { values, errors, setValues, handleChange, handleSubmit } = useForm<ServiceFormData>({
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
      const errors: Partial<ServiceFormData> = {};
      
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
      <div className="bg-blue-600 text-white py-6 px-4 sm:px-6 lg:px-8 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Service Configuration</h1>
          <p className="mt-1 text-blue-100">Add and manage available services</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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

          <div className="p-6">
            <ServiceForm
              values={values}
              errors={errors}
              onChange={handleChange}
              onProviderSelect={handleProviderSelect}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}