import React from 'react';
import { useServices } from '../../hooks/useServices';

interface ServiceSelectProps {
  value: string;
  providerId: string | null;
  onSelect: (serviceName: string, serviceId: string, price: number) => void;
}

export function ServiceSelect({ value, providerId, onSelect }: ServiceSelectProps) {
  const { services, loading, error } = useServices(providerId);

  if (loading) {
    return (
      <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" disabled>
        <option>Loading services...</option>
      </select>
    );
  }

  if (error) {
    return (
      <select className="block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" disabled>
        <option>Failed to load services</option>
      </select>
    );
  }

  if (!providerId) {
    return (
      <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" disabled>
        <option>Select a provider first</option>
      </select>
    );
  }

  if (services.length === 0) {
    return (
      <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" disabled>
        <option>No services available for this provider</option>
      </select>
    );
  }

  return (
    <select
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      value={value}
      onChange={(e) => {
        const selectedService = services.find(s => s.name === e.target.value);
        if (selectedService) {
          onSelect(selectedService.name, selectedService.id, selectedService.price);
        }
      }}
    >
      <option value="">Select a service</option>
      {services.map((service) => (
        <option key={service.id} value={service.name}>
          {service.name}
        </option>
      ))}
    </select>
  );
}