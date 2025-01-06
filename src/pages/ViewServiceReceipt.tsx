import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ServiceReceipt } from '../types/serviceReceipt';
import { ServiceReceiptHeader } from '../components/service/ServiceReceiptHeader';
import { ServiceReceiptTable } from '../components/service/ServiceReceiptTable';
import { PrintableServiceReceipt } from '../components/service/PrintableServiceReceipt';
import { ReceiptHeader } from '../components/service/ReceiptHeader';
import { ReceiptLoading } from '../components/service/ReceiptLoading';
import { ReceiptError } from '../components/service/ReceiptError';

interface ServiceItem {
  id: string;
  serviceName: string;
  serviceId: string;
  serviceCost: number;
  numberOfOperations: number;
  numberOfUnits: number;
}

export default function ViewServiceReceipt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState<ServiceReceipt | null>(null);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReceipt() {
      if (!id) {
        setError('Receipt ID is required');
        setLoading(false);
        return;
      }
      
      try {
        // Fetch receipt header
        const { data: receiptData, error: receiptError } = await supabase
          .from('service_receipts')
          .select('*')
          .eq('id', id)
          .single();

        if (receiptError) throw receiptError;
        if (!receiptData) throw new Error('Receipt not found');

        // Fetch receipt items
        const { data: itemsData, error: itemsError } = await supabase
          .from('service_receipt_items')
          .select('*')
          .eq('receipt_id', id);

        if (itemsError) throw itemsError;

        setReceipt(receiptData);
        setServiceItems(itemsData?.map(item => ({
          id: item.id,
          serviceName: item.service_name,
          serviceId: item.service_id,
          serviceCost: item.service_cost,
          numberOfOperations: item.number_of_operations,
          numberOfUnits: item.number_of_units
        })) || []);
      } catch (err) {
        console.error('Error fetching receipt:', err);
        setError(err instanceof Error ? err.message : 'Failed to load receipt');
      } finally {
        setLoading(false);
      }
    }

    fetchReceipt();
  }, [id]);

  const handlePrint = () => {
    if (!receipt) return;
    
    if (receipt.status !== 'approved') {
      alert('Only approved receipts can be printed');
      return;
    }
    
    window.print();
  };

  if (loading) {
    return <ReceiptLoading />;
  }

  if (error || !receipt) {
    return <ReceiptError error={error || 'Receipt not found'} onBack={() => navigate(-1)} />;
  }

  const headerData = {
    serialNumber: receipt.serial_number,
    warehouseNumber: receipt.warehouse_number,
    serviceProviderName: receipt.service_provider_name,
    serviceProviderCode: receipt.service_provider_code,
    serviceProviderEmail: receipt.service_provider_email,
    serviceProviderPhone: receipt.service_provider_phone,
    wbs: receipt.wbs,
    serviceDate: receipt.service_date,
    storekeeperName: receipt.storekeeper_name
  };

  return (
    <>
      <div className="space-y-6 print:hidden">
        <ReceiptHeader 
          receipt={receipt}
          onBack={() => navigate(-1)}
          onPrint={handlePrint}
        />

        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <ServiceReceiptHeader
            formData={headerData}
            onChange={() => {}}
            onServiceProviderSelect={() => {}}
            readOnly
          />

          <ServiceReceiptTable
            items={serviceItems}
            onAddItem={() => {}}
            onRemoveItem={() => {}}
            onUpdateItem={() => {}}
            readOnly
          />

          {receipt.approved_by_name && (
            <div className="border-t border-gray-200 pt-4 mt-6">
              <div className="text-sm text-gray-500">
                <p>Approved by: {receipt.approved_by_name}</p>
                <p>Approved on: {new Date(receipt.approved_at || '').toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {receipt.status === 'approved' && (
        <PrintableServiceReceipt
          headerData={headerData}
          items={serviceItems}
          approvedBy={receipt.approved_by_name}
          approvedAt={receipt.approved_at}
        />
      )}
    </>
  );
}