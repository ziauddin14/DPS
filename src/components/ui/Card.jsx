/**
 * Card — reusable content wrapper with optional header (title, subtitle, actions) and body.
 *
 * @param {string}            [title]         - Card heading.
 * @param {string}            [subtitle]      - Card sub-heading below the title.
 * @param {React.ReactNode}   [actions]       - Right-aligned header actions (buttons, badges, etc.).
 * @param {React.ReactNode}   children        - Card body content.
 * @param {string}            [padding='p-6'] - Override body padding (e.g. 'p-0' for custom layout).
 * @param {string}            [className]     - Extra classes on the root div.
 */
function Card({ title, subtitle, actions, children, padding = 'p-6', className = '' }) {
  const hasHeader = title || subtitle || actions;

  return (
    <div
      className={[
        'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          {(title || subtitle) && (
            <div className="min-w-0">
              {title && (
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
              )}
            </div>
          )}
          {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
        </div>
      )}
      <div className={padding}>{children}</div>
    </div>
  );
}

export default Card;
export { Card };
