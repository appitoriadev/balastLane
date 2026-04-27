import { useState } from 'react';
import Modal from '../ui/Modal';
import Icon from '../ui/Icon';
import ExpenseForm from './ExpenseForm';
import { useExpenses } from '../../contexts/ExpensesContext';

/**
 * Modal wrapper around ExpenseForm.
 * Handles the create / update API call via ExpensesContext.
 *
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   expense?: object   Pass an existing expense to edit; omit for create
 * }} props
 */
export default function ExpenseModal({ isOpen, onClose, expense }) {
  const { createExpense, updateExpense } = useExpenses();
  const [isSubmitting, setSubmitting]   = useState(false);
  const [success, setSuccess]           = useState(false);

  const handleClose = () => {
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async (dto) => {
    setSubmitting(true);
    try {
      if (expense) {
        await updateExpense(expense.id, dto);
      } else {
        await createExpense(dto);
      }
      setSuccess(true);
      setTimeout(handleClose, 900);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={expense ? 'Edit Expense' : 'Add Expense'}
    >
      {success ? (
        <div className="flex flex-col items-center py-8 gap-3">
          <div className="w-14 h-14 rounded-full bg-success-light flex items-center justify-center">
            <Icon name="check" size={28} className="text-success" />
          </div>
          <p className="text-base font-semibold text-success">Saved successfully!</p>
        </div>
      ) : (
        <ExpenseForm
          key={expense?.id ?? 'new'}
          initialData={expense}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          isSubmitting={isSubmitting}
        />
      )}
    </Modal>
  );
}
