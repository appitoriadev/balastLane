import Badge from '../ui/Badge';
import Icon from '../ui/Icon';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../constants';

/**
 * Single expense row used in both Dashboard (recent list) and Expenses page.
 *
 * @param {{
 *   expense: { id: number, title: string, amount: number, category: string, date: string },
 *   onEdit: (expense: object) => void,
 *   onDelete: (expense: object) => void,
 *   compact?: boolean,
 *   currencySymbol?: string,
 * }} props
 */
export default function ExpenseRow({ expense, onEdit, onDelete, compact = false, currencySymbol = '$' }) {
  const color = CATEGORY_COLORS[expense.category] ?? '#94A3B8';

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-gray-50 transition-colors duration-150 group">
      {/* Category icon */}
      <div
        className={`${compact ? 'w-9 h-9' : 'w-11 h-11'} rounded-xl flex items-center justify-center shrink-0`}
        style={{ backgroundColor: `${color}18` }}
      >
        <span
          className="text-xs font-bold tracking-wide"
          style={{ color }}
        >
          {expense.category.slice(0, 3).toUpperCase()}
        </span>
      </div>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{expense.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge category={expense.category} />
          <span className="text-xs text-gray-500">{formatDate(expense.date)}</span>
        </div>
      </div>

      {/* Amount + actions */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-sm font-semibold text-gray-900 mr-2">
          {formatCurrency(expense.amount, currencySymbol)}
        </span>

        <button
          onClick={() => onEdit(expense)}
          aria-label={`Edit ${expense.title}`}
          className="p-1.5 rounded-lg text-gray-300 hover:text-primary-500 hover:bg-primary-50 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Icon name="edit" size={15} />
        </button>

        <button
          onClick={() => onDelete(expense)}
          aria-label={`Delete ${expense.title}`}
          className="p-1.5 rounded-lg text-gray-300 hover:text-error hover:bg-error-light transition-colors opacity-0 group-hover:opacity-100"
        >
          <Icon name="trash" size={15} />
        </button>
      </div>
    </div>
  );
}
