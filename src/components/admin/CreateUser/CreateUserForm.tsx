import React from 'react';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Button } from '../../ui/Button';
import { UserFormData } from './types';
import { Eye, EyeOff } from 'lucide-react';

interface CreateUserFormProps {
  formData: UserFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
  success: boolean;
  loading: boolean;
}

export function CreateUserForm({
  formData,
  onChange,
  onSubmit,
  error,
  success,
  loading
}: CreateUserFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <form onSubmit={onSubmit} className="p-6 space-y-8">
      {error && (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-facebook-error">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-700">User created successfully!</p>
        </div>
      )}

      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            User Information
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Provide the basic information for the new user.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                required
              />
            </div>

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={onChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-[30px] p-2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={onChange}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Select
                label="Role"
                name="role"
                value={formData.role}
                onChange={onChange}
                options={[
                  { value: 'user', label: 'User' },
                  { value: 'supervisor', label: 'Supervisor' },
                  { value: 'admin', label: 'Admin' }
                ]}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5 border-t border-gray-200">
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.location.href = '/dashboard'}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </div>
      </div>
    </form>
  );
}