import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './ui';

/**
 * ConfirmModal — reusable confirmation dialog.
 *
 * Replaces native window.confirm() with an accessible, styled modal.
 * Closes on ESC key and on backdrop click.
 *
 * @param {boolean}  isOpen    - Whether the modal is visible.
 * @param {string}   title     - Modal heading text.
 * @param {string}   message   - Body message text.
 * @param {Function} onConfirm - Callback when the Delete button is clicked.
 * @param {Function} onCancel  - Callback when Cancel or ESC or backdrop is clicked.
 */
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-message"
    >
      {/* Modal container */}
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-rose-50 dark:bg-rose-900/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400" aria-hidden="true" />
            </div>
            <h3
              id="confirm-modal-title"
              className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight"
            >
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
            aria-label="Close confirmation dialog"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p
            id="confirm-modal-message"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            {message}
          </p>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
export { ConfirmModal };
