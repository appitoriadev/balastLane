/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EEE5FF',
          100: '#E0D4FF',
          200: '#D8C8FF',
          300: '#C5A9FF',
          400: '#A78EFF',
          500: '#6366F1',
          600: '#7C3AED',
          700: '#4F46E5',
          800: '#4338CA',
          900: '#312E81',
        },
        accent: {
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
          800: '#6B21A8',
        },
        gray: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        success: {
          light:   '#ECFDF5',
          DEFAULT: '#10B981',
          dark:    '#059669',
        },
        error: {
          light:   '#FEE2E2',
          DEFAULT: '#EF4444',
          dark:    '#DC2626',
        },
        warning: {
          light:   '#FEF3C7',
          DEFAULT: '#F59E0B',
          dark:    '#D97706',
        },
        info: {
          light:   '#EEE5FF',
          DEFAULT: '#6366F1',
          dark:    '#4F46E5',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"Fira Code"', '"Courier New"', 'monospace'],
      },
      borderRadius: {
        sm:  '4px',
        DEFAULT: '6px',
        md:  '8px',
        lg:  '12px',
        xl:  '16px',
        '2xl': '20px',
        full: '9999px',
      },
      boxShadow: {
        sm:      '0 1px 2px 0 rgba(0,0,0,0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',
        md:      '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        lg:      '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        xl:      '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        primary: '0 4px 12px rgba(99,102,241,0.25)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
