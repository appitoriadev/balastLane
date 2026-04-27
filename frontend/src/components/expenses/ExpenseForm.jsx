import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { useCategories } from '../../hooks/useCategories';
import { toDateInputValue, toApiDate } from '../../utils/formatters';

/**
 * Reusable form for creating and editing expenses.
 * Handles its own validation state; delegates submission to the parent.
 *
 * @param {{
 *   initialData?: object,   Expense to edit, or undefined for create
 *   onSubmit: (dto: object) => Promise<void>,
 *   onCancel: () => void,
 *   isSubmitting: boolean,
 * }} props
 */
export default function ExpenseForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const { categories } = useCategories();
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    title:    initialData?.title    ?? '',
    amount:   initialData?.amount   != null ? String(initialData.amount) : '',
    category: initialData?.category ?? '',
    date:     initialData ? toDateInputValue(initialData.date) : today,
  });

  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState('');

  // Set default category once categories have loaded (if not editing)
  useEffect(() => {
    if (!initialData && !form.category && categories.length > 0) {
      setForm((f) => ({ ...f, category: categories[0] }));
    }
  }, [categories]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())                          e.title    = 'Title is required';
    if (!form.amount || parseFloat(form.amount) <= 0) e.amount   = 'Amount must be greater than 0';
    if (!form.category)                              e.category = 'Category is required';
    if (!form.date)                                  e.date     = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    try {
      await onSubmit({
        title:    form.title.trim(),
        amount:   parseFloat(form.amount),
        category: form.category,
        date:     toApiDate(form.date),
      });
    } catch (err) {
      setApiError(err.message ?? 'Failed to save expense. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {apiError && (
        <Alert type="error" onClose={() => setApiError('')}>
          {apiError}
        </Alert>
      )}

      <Input
        label="Title"
        required
        placeholder="e.g. Grocery Shopping"
        value={form.title}
        onChange={(e) => set('title', e.target.value)}
        error={errors.title}
        disabled={isSubmitting}
        autoFocus
      />

      <Input
        type="number"
        label="Amount ($)"
        required
        step="0.01"
        min="0.01"
        placeholder="0.00"
        value={form.amount}
        onChange={(e) => set('amount', e.target.value)}
        error={errors.amount}
        disabled={isSubmitting}
        className="text-right"
      />

      <Select
        label="Category"
        required
        options={categories.map((c) => ({ value: c, label: c }))}
        placeholder={categories.length === 0 ? 'Loading…' : undefined}
        value={form.category}
        onChange={(e) => set('category', e.target.value)}
        error={errors.category}
        disabled={isSubmitting}
      />

      <Input
        type="date"
        label="Date"
        required
        value={form.date}
        onChange={(e) => set('date', e.target.value)}
        error={errors.date}
        disabled={isSubmitting}
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isSubmitting} fullWidth>
          {initialData ? 'Save Changes' : 'Add Expense'}
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
