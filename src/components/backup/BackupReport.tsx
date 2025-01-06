import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { fetchReceiptsForBackup } from '../../lib/backup';
import { convertToCSV, downloadCSV } from '../../utils/csv';

export function BackupReport() {
  const [loading, setLoading] = useState(false);

  const handleBackup = async () => {
    try {
      setLoading(true);
      
      // Fetch all receipt data
      const receiptsData = await fetchReceiptsForBackup();
      
      // Convert to CSV
      const csv = convertToCSV(receiptsData);
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `service-receipts-backup-${timestamp}.csv`;
      
      // Download the CSV file
      downloadCSV(csv, filename);
    } catch (error) {
      console.error('Error generating backup:', error);
      alert('Failed to generate backup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Backup Service Receipts</h2>
        <p className="text-gray-600 mb-6">
          Create a backup of all service receipts. The backup includes all receipt details,
          service items, and approval status. The data will be downloaded as a CSV file.
        </p>
        <Button
          onClick={handleBackup}
          disabled={loading}
          className="flex items-center"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {loading ? 'Generating Backup...' : 'Generate Backup'}
        </Button>
      </div>
    </div>
  );
}