import React from 'react';
import { Loader2, CheckSquare, CreditCard } from 'lucide-react';
import { Button } from '../ui/Button';
import { approveServiceReceipts, updatePaymentStatus } from '../../lib/serviceReceipts';

interface ReceiptActionsProps {
  selectedForApproval: string[];
  selectedForPayment: string[];
  onApprovalChange: (id: string, checked: boolean) => void;
  onPaymentChange: (id: string, checked: boolean) => void;
  onReceiptsUpdated: () => void;
}

export function ReceiptActions({
  selectedForApproval,
  selectedForPayment,
  onApprovalChange,
  onPaymentChange,
  onReceiptsUpdated
}: ReceiptActionsProps) {
  const [approving, setApproving] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);

  const handleApproveReceipts = async () => {
    if (selectedForApproval.length === 0) {
      alert('Please select at least one receipt to approve');
      return;
    }

    setApproving(true);
    try {
      const { success, error } = await approveServiceReceipts(selectedForApproval);
      
      if (!success) throw error;
      
      onReceiptsUpdated();
      alert('Receipts approved successfully');
    } catch (err) {
      console.error('Error approving receipts:', err);
      alert('Failed to approve receipts. Please try again.');
    } finally {
      setApproving(false);
    }
  };

  const handleUpdatePaymentStatus = async () => {
    if (selectedForPayment.length === 0) {
      alert('Please select at least one receipt to mark as paid');
      return;
    }

    setProcessing(true);
    try {
      const { success, error } = await updatePaymentStatus(selectedForPayment);
      
      if (!success) throw error;
      
      onReceiptsUpdated();
      alert('Payment status updated successfully');
    } catch (err) {
      console.error('Error updating payment status:', err);
      alert('Failed to update payment status. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex justify-between">
      {selectedForApproval.length > 0 && (
        <Button
          onClick={handleApproveReceipts}
          disabled={approving}
          className="flex items-center"
        >
          {approving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <CheckSquare className="h-4 w-4 mr-2" />
          )}
          {approving ? 'Approving...' : `Approve Selected (${selectedForApproval.length})`}
        </Button>
      )}

      {selectedForPayment.length > 0 && (
        <Button
          onClick={handleUpdatePaymentStatus}
          disabled={processing}
          className="flex items-center"
        >
          {processing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <CreditCard className="h-4 w-4 mr-2" />
          )}
          {processing ? 'Processing...' : `Mark as Paid (${selectedForPayment.length})`}
        </Button>
      )}
    </div>
  );
}