import { cn } from '../../utils/cn';

/**
 * Animated loading placeholder that mimics content layout.
 *
 * @param {{
 *   height?: string,   Tailwind height class, e.g. 'h-16'
 *   className?: string
 * }} props
 */
export default function Skeleton({ height = 'h-16', className = '' }) {
  return (
    <div
      className={cn('bg-gray-100 rounded-xl animate-pulse', height, className)}
      aria-hidden="true"
    />
  );
}
