import DonutChart from '../charts/DonutChart';
import Skeleton from '../ui/Skeleton';
import { formatCurrency } from '../../utils/formatters';
import { CATEGORY_COLORS, DEFAULT_CATEGORIES } from '../../constants';

/**
 * Donut chart + category legend for the dashboard.
 *
 * @param {{
 *   expenses: object[],   This month's expenses
 *   total: number,
 *   loading: boolean,
 *   currencySymbol: string,
 * }} props
 */
export default function CategoryBreakdown({ expenses, total, loading, currencySymbol }) {
  const chartData = DEFAULT_CATEGORIES
    .map((cat) => ({
      label: cat,
      color: CATEGORY_COLORS[cat],
      value: expenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0),
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-5">Spending by Category</h2>

      {loading ? (
        <Skeleton height="h-44" />
      ) : chartData.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-10">No expenses this month yet.</p>
      ) : (
        <div className="flex flex-wrap items-center gap-8">
          {/* Donut */}
          <div className="relative shrink-0">
            <DonutChart data={chartData} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Total</span>
              <span className="text-base font-semibold text-gray-900">
                {formatCurrency(total, currencySymbol)}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 min-w-[160px] space-y-2.5">
            {chartData.map((d) => (
              <div key={d.label} className="flex items-center gap-2.5">
                <div
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-sm text-gray-600 flex-1">{d.label}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(d.value, currencySymbol)}
                </span>
                <span className="text-xs text-gray-400 w-8 text-right">
                  {total > 0 ? `${((d.value / total) * 100).toFixed(0)}%` : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
