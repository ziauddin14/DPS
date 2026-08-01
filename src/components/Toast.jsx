import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

/**
 * Toast — lightweight notification display component.
 *
 * Renders a fixed stack of toast messages at the bottom-left of the viewport.
 * Each toast auto-dismisses after 3s (managed by the useToast hook).
 *
 * @param {Array}    toasts    - Array of { id, message, type } objects.
 *                               type: 'success' | 'error' | 'info'
 * @param {Function} onRemove  - Callback to manually dismiss a toast: (id) => void
 */
function Toast({ toasts, onRemove }) {
  if (!toasts || !toasts.length) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-6 left-6 z-[60] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isInfo    = toast.type === 'info';

        const containerClass = isSuccess
          ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
          : isInfo
          ? 'bg-sky-50 dark:bg-sky-900/30 border-sky-100 dark:border-sky-800 text-sky-800 dark:text-sky-200'
          : 'bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800 text-rose-800 dark:text-rose-200';

        const dismissClass = isSuccess
          ? 'text-emerald-400 dark:text-emerald-300 hover:text-emerald-700 dark:hover:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-800 focus:ring-emerald-300'
          : isInfo
          ? 'text-sky-400 dark:text-sky-300 hover:text-sky-700 dark:hover:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-800 focus:ring-sky-300'
          : 'text-rose-400 dark:text-rose-300 hover:text-rose-700 dark:hover:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-800 focus:ring-rose-300';

        const Icon = isSuccess ? CheckCircle2 : isInfo ? Info : XCircle;
        const iconClass = isSuccess
          ? 'text-emerald-500 dark:text-emerald-400'
          : isInfo
          ? 'text-sky-500 dark:text-sky-400'
          : 'text-rose-500 dark:text-rose-400';

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl shadow-lg border text-sm font-semibold animate-[slideInLeft_0.25s_ease-out] ${containerClass}`}
          >
            {/* Icon */}
            <Icon className={`w-4 h-4 flex-shrink-0 ${iconClass}`} aria-hidden="true" />

            {/* Message */}
            <span className="max-w-[240px] leading-snug">{toast.message}</span>

            {/* Manual dismiss */}
            <button
              type="button"
              onClick={() => onRemove(toast.id)}
              className={`ml-1 p-0.5 rounded-lg transition-colors focus:outline-none focus:ring-2 ${dismissClass}`}
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Toast;
export { Toast };
