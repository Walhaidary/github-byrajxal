import React, { useState } from 'react';
import { Loader2, CheckSquare, CreditCard } from 'lucide-react';
import { Button } from '../../ui/Button';
import { reverseApproval, reversePaymentStatus } from '../../../lib/serviceReceipts';

interface AdminReceiptActionsProps {
  selectedForApproval: string[];
  selectedForPayment: string[];
  onReceiptsUpdated: () => void;
}

export function AdminReceiptActions({
  selectedForApproval,
  selectedForPayment,
  onReceiptsUpdated
}: AdminReceiptActionsProps) {
  const [approving, setApproving] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleReverseApproval = async () => {
    if (selectedForApproval.length === 0) {
      alert('Please select at least one receipt');
      return;
    }

    if (!confirm('Are you sure you want to reverse the approval status of the selected receipts?')) {
      return;
    }

    setApproving(true);
    try {
      const { success, error } = await reverseApproval(selectedForApproval);
      
      if (!success) throw error;
      
      onReceiptsUpdated();
      alert('Approval status reversed successfully');
    } catch (err) {
      console.error('Error reversing approval:', err);
      alert('Failed to reverse approval status. Please try again.');
    } finally {
      setApproving(false);
    }
  };

  const handleReversePayment = async () => {
    if (selectedForPayment.length === 0) {
      alert('Please select at least one receipt');
      return;
    }

    if (!confirm('Are you sure you want to reverse the payment status of the selected receipts?')) {
      return;
    }

    setProcessing(true);
    try {
      const { success, error } = await reversePaymentStatus(selectedForPayment);
      
      if (!success) throw error;
      
      onReceiptsUpdated();
      alert('Payment status reversed successfully');
    } catch (err) {
      console.error('Error reversing payment status:', err);
      alert('Failed to reverse payment status. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex justify-between">
      {selectedForApproval.length > 0 && (
        <Button
          onClick={handleReverseApproval}
          disabled={approving}
          className="flex items-center"
        >
          {approving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <CheckSquare className="h-4 w-4 mr-2" />
          )}
          {approving ? 'Processing...' : `Reverse Approval (${selectedForApproval.length})`}
        </Button>
      )}

      {selectedForPayment.length > 0 && (
        <Button
          onClick={handleReversePayment}
          disabled={processing}
          className="flex items-center"
        >
          {processing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <CreditCard className="h-4 w-4 mr-2" />
          )}
          {processing ? 'Processing...' : `Reverse Payment Status (${selectedForPayment.length})`}
        </Button>
      )}
    </div>
  );
}