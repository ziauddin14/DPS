/**
 * PageHeader — reusable top-of-page banner with icon, title, subtitle, and actions slot.
 *
 * Matches the existing page-header visual pattern used throughout the DPS project:
 * white card, rounded-2xl, shadow-sm, responsive padding.
 *
 * @param {string}          title        - Main page heading (renders as <h2>).
 * @param {string}          [subtitle]   - Supporting description text.
 * @param {React.ReactNode} [icon]       - Lucide icon element shown left of the title.
 * @param {React.ReactNode} [actions]    - Right-aligned elements (buttons, links, etc.).
 * @param {string}          [className]  - Extra classes on the root div.
 */
function PageHeader({ title, subtitle, icon, actions, className = '' }) {
  return (
    <div
      className={[
        'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4',
        'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm p-6 sm:p-8',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Left: icon + title + subtitle */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {icon && (
            <span aria-hidden="true" className="flex-shrink-0">
              {icon}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium mt-1">{subtitle}</p>
        )}
      </div>

      {/* Right: actions slot */}
      {actions && (
        <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>
      )}
    </div>
  );
}

export default PageHeader;
export { PageHeader };
