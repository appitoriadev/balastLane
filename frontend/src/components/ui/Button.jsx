import { cn } from '../../utils/cn';

const VARIANTS = {
  primary:   'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500',
  secondary: 'bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 focus-visible:ring-primary-500',
  danger:    'bg-error text-white hover:bg-error-dark focus-visible:ring-error',
  ghost:     'bg-transparent text-primary-500 hover:text-primary-600 focus-visible:ring-primary-500 px-0',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

/**
 * @param {{
 *   children: React.ReactNode,
 *   variant?: 'primary'|'secondary'|'danger'|'ghost',
 *   size?: 'sm'|'md'|'lg',
 *   disabled?: boolean,
 *   loading?: boolean,
 *   onClick?: () => void,
 *   type?: 'button'|'submit'|'reset',
 *   fullWidth?: boolean,
 *   className?: string,
 * }} props
 */
export default function Button({
  children,
  variant   = 'primary',
  size      = 'md',
  disabled  = false,
  loading   = false,
  onClick,
  type      = 'button',
  fullWidth = false,
  className = '',
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-lg',
        'transition-all duration-150 active:scale-95',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading ? 'Loading…' : children}
    </button>
  );
}
