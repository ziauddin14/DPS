/**
 * Select — reusable dropdown selector.
 *
 * @param {string}            [label]             - Visible label text.
 * @param {string}            [id]                - Links label htmlFor and select id.
 * @param {boolean}           [required=false]    - Shows asterisk on label and sets HTML required.
 * @param {string}            [error]             - Error message; changes border to rose.
 * @param {boolean}           [labelHidden=false] - Renders label as sr-only (accessible, visually hidden).
 * @param {string}            [wrapperClassName]  - Extra classes on the outer wrapper div.
 * @param {string}            [className]         - Extra classes on the <select> element.
 * @param {Array}             [options=[]]        - Array of strings OR { value, label } objects.
 * @param {string}            [placeholder]       - First disabled option acting as prompt text.
 * All other props (value, onChange, defaultValue, name, disabled…) forwarded to the <select>.
 */
function Select({
  label,
  id,
  required = false,
  error,
  labelHidden = false,
  wrapperClassName = '',
  className = '',
  options = [],
  placeholder,
  ...htmlProps
}) {
  const hasLabel = Boolean(label);
  const showSpacing = hasLabel && !labelHidden;

  return (
    <div className={[showSpacing ? 'space-y-1.5' : '', wrapperClassName].filter(Boolean).join(' ')}>
      {hasLabel && (
        <label
          htmlFor={id}
          className={labelHidden ? 'sr-only' : 'text-sm font-bold text-slate-700 dark:text-slate-300'}
        >
          {label}
          {required && (
            <span className="text-rose-500 ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <select
        id={id}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[
          error ? `${id}-error` : null,
          htmlProps['aria-describedby'] || null
        ].filter(Boolean).join(' ') || undefined}
        className={[
          'w-full px-3.5 py-2.5 rounded-xl border text-sm font-bold text-slate-600 dark:text-slate-200 bg-white dark:bg-slate-700',
          'transition-all cursor-pointer',
          'focus:outline-none focus:ring-2 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-rose-300 focus:ring-rose-400'
            : 'border-slate-200 dark:border-slate-600 focus:ring-primary-500',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...htmlProps}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const lbl = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>

      {error && (
        <p id={`${id}-error`} className="text-xs font-semibold text-rose-500 dark:text-rose-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;
export { Select };
