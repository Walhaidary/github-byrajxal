import React, { useState } from 'react';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Button } from '../../ui/Button';
import { ProfileFormData } from './types';
import { Eye, EyeOff } from 'lucide-react';

interface CreateProfileFormProps {
  formData: ProfileFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
  success: boolean;
  loading: boolean;
}

export function CreateProfileForm({
  formData,
  onChange,
  onSubmit,
  error,
  success,
  loading
}: CreateProfileFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-700">Profile created successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          required
        />

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

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Creating...' : 'Create Profile'}
      </Button>
    </form>
  );
}