import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface ReceiptErrorProps {
  error: string;
  onBack: () => void;
}

export function ReceiptError({ error, onBack }: ReceiptErrorProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="bg-red-50 p-8 rounded-lg max-w-md w-full text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
        <p className="text-red-700 mb-6">{error}</p>
        <Button variant="secondary" onClick={onBack}>
          Go Back
        </Button>
      </div>
    </div>
  );
}