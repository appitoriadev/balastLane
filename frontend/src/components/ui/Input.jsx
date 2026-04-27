import { useId } from 'react';
import { cn } from '../../utils/cn';

/**
 * Labelled text / number / date input with error and helper text support.
 *
 * @param {{
 *   label?: string,
 *   error?: string,
 *   helperText?: string,
 *   required?: boolean,
 *   className?: string,
 * } & React.InputHTMLAttributes<HTMLInputElement>} props
 */
export default function Input({
  label,
  error,
  helperText,
  required,
  className = '',
  ...props
}) {
  const id = useId();

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className={cn('block text-sm font-semibold mb-1.5', error ? 'text-error' : 'text-gray-900')}
        >
          {label}
          {required && <span className="text-error ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}

      <input
        id={id}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-hint` : undefined}
        className={cn(
          'w-full px-3 py-2.5 rounded-lg text-sm text-gray-900 bg-white',
          'border-2 transition-colors duration-150',
          'placeholder:text-gray-400',
          'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-50',
          'disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400',
          error ? 'border-error' : 'border-gray-200',
          className,
        )}
        {...props}
      />

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-error">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
