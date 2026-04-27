import { CATEGORY_COLORS } from '../../constants';

/**
 * Colored pill badge for expense categories.
 * Uses inline styles for color because Tailwind cannot generate dynamic class names.
 *
 * @param {{ category: string }} props
 */
export default function Badge({ category }) {
  const color = CATEGORY_COLORS[category] ?? '#94A3B8';

  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: `${color}1E`, color }}
    >
      {category}
    </span>
  );
}
