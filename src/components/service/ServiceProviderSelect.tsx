import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface ServiceProvider {
  id: string;
  company_name: string;
  vendor_number: string;
}

interface ServiceProviderSelectProps {
  value: string;
  onSelect: (name: string, id: string) => void;
  error?: string;
}

export function ServiceProviderSelect({ value, onSelect, error }: ServiceProviderSelectProps) {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProviders() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('service_providers')
          .select('id, company_name, vendor_number')
          .eq('status', 'active')
          .order('company_name');

        if (fetchError) throw fetchError;
        setProviders(data || []);
      } catch (err) {
        console.error('Error fetching providers:', err);
        setError('Failed to load service providers');
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProvider = providers.find(p => p.company_name === e.target.value);
    if (selectedProvider) {
      onSelect(selectedProvider.company_name, selectedProvider.id);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Service Provider
          <span className="text-red-500 ml-1">*</span>
        </label>
        <select 
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg" 
          disabled
        >
          <option>Loading providers...</option>
        </select>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Service Provider
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600 mb-2">{fetchError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="text-sm text-red-600 hover:text-red-800 underline"
          >
            Retry loading providers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Service Provider
        <span className="text-red-500 ml-1">*</span>
      </label>
      <select
        className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-1 ${
          error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
        }`}
        value={value}
        onChange={handleChange}
        required
      >
        <option value="">Select a service provider</option>
        {providers.map((provider) => (
          <option key={provider.id} value={provider.company_name}>
            {provider.company_name}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}