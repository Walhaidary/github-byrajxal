import React from 'react';
import { useDelayedReceipts } from '../../hooks/useDelayedReceipts';
import { DelayedReceiptsTable } from './DelayedReceiptsTable';

export function TrendsSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <DelayedReceiptsTable />
    </div>
  );
}