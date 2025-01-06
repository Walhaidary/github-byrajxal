import { ServiceReceipt } from '../types/serviceReceipt';

export function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  // Define custom header labels
  const headerMap: { [key: string]: string } = {
    receipt_id: 'Receipt ID',
    serial_number: 'Serial Number',
    warehouse_number: 'Warehouse Number',
    service_provider_name: 'Service Provider',
    service_provider_code: 'Provider Code',
    wbs: 'WBS',
    service_date: 'Service Date',
    storekeeper_name: 'Storekeeper',
    receipt_total_cost: 'Receipt Total Cost',
    status: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    approved_by: 'Approved By',
    approved_by_name: 'Approver Name',
    approved_at: 'Approved At',
    item_id: 'Item ID',
    service_name: 'Service Name',
    service_id: 'Service ID',
    service_cost: 'Service Cost',
    number_of_operations: 'Number of Operations',
    number_of_units: 'Number of Units',
    item_total_cost: 'Item Total Cost'
  };
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add headers with custom labels
  csvRows.push(headers.map(header => headerMap[header] || header).join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle special cases and escape values
      if (value === null || value === undefined) return '';
      if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
      if (typeof value === 'object') {
        if (value instanceof Date) {
          return `"${value.toISOString()}"`;
        }
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      if (typeof value === 'number') {
        // Format numbers with 2 decimal places
        return Number.isInteger(value) ? value : value.toFixed(2);
      }
      return value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

export function downloadCSV(csv: string, filename: string): void {
  // Add BOM for Excel UTF-8 compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    // Other browsers
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}