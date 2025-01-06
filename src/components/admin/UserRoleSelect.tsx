import React from 'react';
import { Select } from '../ui/Select';

interface UserRoleSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'admin', label: 'Admin' }
];

export function UserRoleSelect({ value, onChange, disabled }: UserRoleSelectProps) {
  return (
    <Select
      label=""
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={ROLE_OPTIONS}
      disabled={disabled}
      className="min-w-[120px]"
    />
  );
}