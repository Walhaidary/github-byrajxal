import React, { useEffect, useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { supabase } from '../../lib/supabase';
import { Loader2, Trash2, Info } from 'lucide-react';

interface ServiceProvider {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string;
  phone: string | null;
  vendor_number: string;
  service_categories: string[];
  status: 'active' | 'inactive';
  created_at: string;
}

interface ServiceProviderForm {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  vendorNumber: string;
  serviceCategories: string[];
  status: 'active' | 'inactive';
}

const SERVICE_CATEGORIES = [
  'Maintenance',
  'Repair',
  'Installation',
  'Consultation',
  'Emergency Services',
  'Inspection',
  'Other'
];

const initialValues: ServiceProviderForm = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  vendorNumber: '',
  serviceCategories: [],
  status: 'active',
};

export default function ServiceProviderManagement() {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const { values, errors, handleChange, handleSubmit, setValues, setErrors } = useForm<ServiceProviderForm>({
    initialValues,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        // Check if vendor number already exists
        const { data: existingProvider, error: checkError } = await supabase
          .from('service_providers')
          .select('id')
          .eq('vendor_number', values.vendorNumber)
          .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
          throw checkError;
        }

        if (existingProvider) {
          setErrors({
            vendorNumber: 'This vendor number is already in use'
          });
          return;
        }

        const { data, error } = await supabase
          .from('service_providers')
          .insert([{
            company_name: values.companyName,
            contact_name: values.contactName || null,
            email: values.email,
            phone: values.phone || null,
            vendor_number: values.vendorNumber,
            service_categories: values.serviceCategories,
            status: values.status
          }])
          .select();

        if (error) throw error;

        if (data?.[0]) {
          setProviders(prev => [...prev, data[0] as ServiceProvider]);
        }

        setValues(initialValues);
        alert('Service provider added successfully!');
      } catch (error: any) {
        console.error('Error adding service provider:', error);
        if (error.code === '23505') { // PostgreSQL unique constraint violation
          setErrors({
            vendorNumber: 'This vendor number is already in use'
          });
        } else {
          alert(error.message || 'Error adding service provider');
        }
      } finally {
        setLoading(false);
      }
    },
    validate: (values) => {
      const errors: Partial<ServiceProviderForm> = {};
      if (!values.companyName.trim()) {
        errors.companyName = 'Company name is required';
      }
      if (!values.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Invalid email format';
      }
      if (!values.vendorNumber.trim()) {
        errors.vendorNumber = 'Vendor number is required';
      }
      return errors;
    },
  });

  useEffect(() => {
    async function fetchProviders() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('service_providers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const processedData = (data || []).map(provider => ({
          ...provider,
          service_categories: Array.isArray(provider.service_categories) ? 
            provider.service_categories : 
            []
        }));
        
        setProviders(processedData);
      } catch (error) {
        console.error('Error fetching providers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service provider?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      const { error } = await supabase
        .from('service_providers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProviders(prev => prev.filter(p => p.id !== id));
    } catch (error: any) {
      console.error('Error deleting provider:', error);
      alert(error.message || 'Error deleting provider');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-6 px-4 sm:px-6 lg:px-8 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Service Provider Management</h1>
          <p className="mt-1 text-blue-100">Add and manage service providers</p>
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
                  <p>All service providers must have a valid vendor number and contact information.</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            <div className="space-y-8 divide-y divide-gray-200">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Basic Information
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Provide the basic details of the service provider.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input
                    label="Company Name"
                    name="companyName"
                    value={values.companyName}
                    onChange={handleChange}
                    error={errors.companyName}
                    required
                  />

                  <Input
                    label="Contact Name"
                    name="contactName"
                    value={values.contactName}
                    onChange={handleChange}
                  />

                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />

                  <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                  />

                  <Tooltip content="Unique identifier for the service provider">
                    <Input
                      label="Vendor Number"
                      name="vendorNumber"
                      value={values.vendorNumber}
                      onChange={handleChange}
                      error={errors.vendorNumber}
                      required
                    />
                  </Tooltip>

                  <Select
                    label="Status"
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                    ]}
                  />
                </div>
              </div>

              <div className="pt-8">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Service Categories
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select all applicable service categories.
                </p>

                <div className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {SERVICE_CATEGORIES.map(category => (
                      <label key={category} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="serviceCategories"
                          value={category}
                          checked={values.serviceCategories.includes(category)}
                          onChange={(e) => {
                            const newCategories = e.target.checked
                              ? [...values.serviceCategories, category]
                              : values.serviceCategories.filter(c => c !== category);
                            handleChange({
                              target: {
                                name: 'serviceCategories',
                                value: newCategories
                              }
                            } as any);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-gray-200">
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="ml-3"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Add Service Provider'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Service Providers</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {providers.map(provider => (
              <div key={provider.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {provider.company_name}
                    </h3>
                    <div className="mt-1 text-sm text-gray-500 space-y-1">
                      <p>Contact: {provider.contact_name || 'N/A'}</p>
                      <p>Email: {provider.email}</p>
                      <p>Phone: {provider.phone || 'N/A'}</p>
                      <p>Vendor #: {provider.vendor_number}</p>
                      <p>Status: <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        provider.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {provider.status}
                      </span></p>
                    </div>
                    {provider.service_categories?.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-900">Services:</h4>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {provider.service_categories.map(category => (
                            <span
                              key={category}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => handleDelete(provider.id)}
                    disabled={deleteLoading === provider.id}
                  >
                    {deleteLoading === provider.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
            {providers.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No service providers found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}