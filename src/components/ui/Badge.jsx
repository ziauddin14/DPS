/**
 * Badge color variant → Tailwind class mapping.
 * All class names are fully spelled out for Tailwind JIT compatibility.
 */
const VARIANT_CLASSES = {
  success: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800',
  warning: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800',
  danger:  'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-800',
  info:    'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800',
  neutral: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600',
};

/**
 * Badge — small status/category label pill.
 *
 * @param {'success'|'warning'|'danger'|'info'|'neutral'} [variant='neutral']
 * @param {string} [className] - Extra classes on the root span.
 */
function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border',
        VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.neutral,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}

export default Badge;
export { Badge };
