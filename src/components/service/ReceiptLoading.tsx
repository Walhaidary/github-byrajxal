import React from 'react';

export function ReceiptLoading() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
        <p className="text-gray-600">Loading receipt details...</p>
      </div>
    </div>
  );
}