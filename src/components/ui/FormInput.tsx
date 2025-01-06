import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({
  id,
  name,
  type,
  label,
  value,
  error,
  disabled = false,
  required = false,
  autoComplete,
  showPassword,
  onTogglePassword,
  onChange,
}: FormInputProps) {
  const isPasswordInput = type === 'password' && onTogglePassword;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`block w-full rounded-md border ${
            error ? 'border-red-300' : 'border-gray-300'
          } px-3 py-2 ${isPasswordInput ? 'pr-10' : ''} shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        {isPasswordInput && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={onTogglePassword}
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}