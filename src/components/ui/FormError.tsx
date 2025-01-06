import React from 'react';

interface FormErrorProps {
  message: string;
}

export default function FormError({ message }: FormErrorProps) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <p className="text-sm text-facebook-error">{message}</p>
    </div>
  );
}