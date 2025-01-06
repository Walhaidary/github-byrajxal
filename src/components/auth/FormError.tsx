import React from 'react';

interface FormErrorProps {
  message: string;
}

export function FormError({ message }: FormErrorProps) {
  return (
    <div className="bg-red-50 p-4 rounded-md">
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
}