import React from 'react';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Button } from '../../ui/Button';
import { ServiceProviderSelect } from '../../service/ServiceProviderSelect';
import { ServiceFormData } from './types';

interface ServiceFormProps {
  values: ServiceFormData;
  errors: Partial<ServiceFormData>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onProviderSelect: (name: string, id: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ServiceForm({
  values,
  errors,
  onChange,
  onProviderSelect,
  onSubmit
}: ServiceFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
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
              onChange={onChange}
              error={errors.name}
              required
            />

            <Input
              label="Category"
              name="category"
              value={values.category}
              onChange={onChange}
            />

            <ServiceProviderSelect
              value={values.providerName}
              onSelect={onProviderSelect}
              error={errors.providerId}
            />

            <Input
              label="Price"
              type="number"
              name="price"
              value={values.price}
              onChange={onChange}
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
                onChange={onChange}
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
  );
}