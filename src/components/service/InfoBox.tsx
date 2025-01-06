import React from 'react';
import { Info } from 'lucide-react';

export function InfoBox() {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <Info className="h-5 w-5 text-blue-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">
            Important Information
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>Please ensure all required fields are filled out accurately. The service receipt will be reviewed for approval once submitted.</p>
          </div>
        </div>
      </div>
    </div>
  );
}