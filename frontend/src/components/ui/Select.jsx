import { useId } from 'react';
import { cn } from '../../utils/cn';

/**
 * Labelled select / dropdown with error support.
 *
 * @param {{
 *   label?: string,
 *   error?: string,
 *   required?: boolean,
 *   options: Array<{ value: string, label: string }>,
 *   placeholder?: string,
 *   value: string,
 *   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
 *   disabled?: boolean,
 *   className?: string,
 * }} props
 */
export default function Select({
  label,
  error,
  required,
  options,
  placeholder,
  value,
  onChange,
  disabled = false,
  className = '',
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

      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          'w-full px-3 py-2.5 rounded-lg text-sm text-gray-900 bg-white',
          'border-2 transition-colors duration-150 cursor-pointer',
          'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-50',
          'disabled:bg-gray-50 disabled:cursor-not-allowed',
          error ? 'border-error' : 'border-gray-200',
          className,
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
}
