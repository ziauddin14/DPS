/**
 * Input — reusable text input field with label, helper text, error state, and optional left icon.
 *
 * @param {string}            [label]            - Visible label text.
 * @param {string}            [id]               - Links label htmlFor and input id.
 * @param {boolean}           [required=false]   - Shows asterisk on label and sets HTML required.
 * @param {string}            [error]            - Error message; changes border to rose.
 * @param {string}            [helperText]       - Subtle hint shown below the input.
 * @param {boolean}           [labelHidden=false]- Renders label as sr-only (accessible, visually hidden).
 * @param {React.ReactNode}   [leftAddon]        - Icon or element placed inside the left side of the input.
 * @param {string}            [wrapperClassName] - Extra classes on the outer wrapper div.
 * @param {string}            [className]        - Extra classes on the <input> element.
 * All other props are forwarded to the underlying <input>.
 */
function Input({
  label,
  id,
  required = false,
  error,
  helperText,
  labelHidden = false,
  leftAddon,
  wrapperClassName = '',
  className = '',
  ...htmlProps
}) {
  const hasLabel = Boolean(label);
  const showSpacing = hasLabel && !labelHidden; // only apply space-y when label is visible

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

      <div className={leftAddon ? 'relative' : undefined}>
        {leftAddon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            {leftAddon}
          </div>
        )}
        <input
          id={id}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={[
            error ? `${id}-error` : null,
            helperText ? `${id}-helper` : null,
            htmlProps['aria-describedby'] || null
          ].filter(Boolean).join(' ') || undefined}
          className={[
            'w-full py-2.5 rounded-xl border text-sm font-semibold text-slate-700 dark:text-slate-200 dark:bg-slate-700',
            'placeholder-slate-400 dark:placeholder-slate-500 transition-all',
            'focus:outline-none focus:ring-2 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-800',
            leftAddon ? 'pl-11 pr-4' : 'px-3.5',
            error
              ? 'border-rose-300 focus:ring-rose-400'
              : 'border-slate-200 dark:border-slate-600 focus:ring-primary-500',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...htmlProps}
        />
      </div>

      {error && (
        <p id={`${id}-error`} className="text-xs font-semibold text-rose-500 dark:text-rose-400" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${id}-helper`} className="text-xs font-medium text-slate-400 dark:text-slate-500">{helperText}</p>
      )}
    </div>
  );
}

export default Input;
export { Input };
