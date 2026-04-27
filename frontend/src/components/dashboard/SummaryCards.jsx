import Icon from '../ui/Icon';
import Skeleton from '../ui/Skeleton';
import { formatCurrency } from '../../utils/formatters';

/**
 * Three metric cards at the top of the dashboard.
 *
 * @param {{
 *   totalThisMonth: number,
 *   totalLastMonth: number,
 *   countThisMonth: number,
 *   monthName: string,
 *   loading: boolean,
 *   currencySymbol: string,
 * }} props
 */
export default function SummaryCards({
  totalThisMonth,
  totalLastMonth,
  countThisMonth,
  monthName,
  loading,
  currencySymbol,
}) {
  const trend =
    totalLastMonth > 0
      ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100
      : null;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height="h-24" className="rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
      {/* This month — primary card */}
      <div className="rounded-xl p-5 text-white bg-gradient-to-br from-primary-500 to-primary-600 shadow-primary">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-2">
          This Month
        </p>
        <p className="text-3xl font-semibold leading-none mb-2">
          {formatCurrency(totalThisMonth, currencySymbol)}
        </p>
        {trend !== null && (
          <div className="flex items-center gap-1 text-xs opacity-90">
            <Icon name={trend >= 0 ? 'trend-up' : 'trend-down'} size={13} />
            {Math.abs(trend).toFixed(1)}% vs last month
          </div>
        )}
      </div>

      {/* Last month */}
      <div className="rounded-xl p-5 bg-white border border-gray-200">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Last Month
        </p>
        <p className="text-3xl font-semibold text-gray-900 leading-none">
          {formatCurrency(totalLastMonth, currencySymbol)}
        </p>
      </div>

      {/* Transaction count */}
      <div className="rounded-xl p-5 bg-white border border-gray-200">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Transactions
        </p>
        <p className="text-3xl font-semibold text-gray-900 leading-none mb-1">
          {countThisMonth}
        </p>
        <p className="text-xs text-gray-500">{monthName}</p>
      </div>
    </div>
  );
}
