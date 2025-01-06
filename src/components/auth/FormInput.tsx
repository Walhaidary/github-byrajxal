import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export function FormInput({ label, name, type, value, onChange, required }: FormInputProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="block w-full rounded-md border border-gray-300 px-3 py-2 
                 shadow-sm focus:border-[#3485b7] focus:outline-none focus:ring-1 
                 focus:ring-[#3485b7] text-sm"
      />
    </div>
  );
}