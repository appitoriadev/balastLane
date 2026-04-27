import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { useExpenses } from '../../contexts/ExpensesContext';

/**
 * Confirmation modal for deleting an expense.
 *
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   expense: object,
 * }} props
 */
export default function DeleteModal({ isOpen, onClose, expense }) {
  const { deleteExpense }      = useExpenses();
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState('');

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteExpense(expense.id);
      onClose();
    } catch (err) {
      setError(err.message ?? 'Failed to delete expense.');
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Expense" size="sm">
      {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}

      <p className="text-sm text-gray-600 mb-2">You are about to delete:</p>
      <p className="text-base font-semibold text-gray-900 mb-6">{expense?.title}</p>
      <p className="text-sm text-gray-500 mb-8">This action cannot be undone.</p>

      <div className="flex gap-3">
        <Button variant="danger" loading={loading} onClick={handleConfirm} fullWidth>
          Delete
        </Button>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
