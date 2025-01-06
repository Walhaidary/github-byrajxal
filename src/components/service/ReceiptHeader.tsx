import React from 'react';
import { ArrowLeft, Printer, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { ServiceReceipt } from '../../types/serviceReceipt';

interface ReceiptHeaderProps {
  receipt: ServiceReceipt | null;
  onBack: () => void;
  onPrint: () => void;
}

export function ReceiptHeader({ receipt, onBack, onPrint }: ReceiptHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Button
          variant="secondary"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Service Receipt Details</h1>
      </div>
      
      {receipt && (
        <>
          {receipt.status === 'approved' ? (
            <Button
              onClick={onPrint}
              className="flex items-center"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
          ) : (
            <div className="flex items-center text-amber-600">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">Receipt must be approved before printing</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}