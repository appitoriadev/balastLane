import { useEffect } from 'react';
import Icon from './Icon';

/**
 * Accessible modal overlay.
 * Clicking the backdrop or pressing Escape closes the modal.
 *
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   title: string,
 *   children: React.ReactNode,
 *   size?: 'sm'|'md'|'lg',
 * }} props
 */
export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className={`bg-white rounded-2xl w-full ${maxWidths[size]} max-h-[92vh] overflow-y-auto shadow-xl animate-slide-up`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
