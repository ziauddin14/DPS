import { Loader2 } from 'lucide-react';

/**
 * Variant → Tailwind class mapping.
 * All class names are spelled out in full so Tailwind JIT never purges them.
 */
const VARIANT_CLASSES = {
  primary:
    'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white shadow-sm shadow-primary-100 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
  secondary:
    'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 active:bg-slate-200 dark:active:bg-slate-600 text-slate-700 dark:text-slate-200 focus:ring-slate-300',
  danger:
    'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-sm shadow-rose-100 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
  ghost:
    'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 focus:ring-slate-300',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
};

/**
 * Button — reusable action button.
 *
 * @param {'primary'|'secondary'|'danger'|'ghost'} [variant='primary']
 * @param {'sm'|'md'|'lg'} [size='md']
 * @param {boolean} [loading=false]   - Shows spinner; disables the button.
 * @param {boolean} [disabled=false]
 * @param {React.ReactNode} [leftIcon]
 * @param {React.ReactNode} [rightIcon]
 * @param {boolean} [fullWidth=false]
 * @param {string}  [type='button']
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  type = 'button',
  ...htmlProps
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-bold transition-all',
        'focus:outline-none focus:ring-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary,
        SIZE_CLASSES[size] ?? SIZE_CLASSES.md,
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...htmlProps}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" aria-hidden="true" />
      ) : leftIcon ? (
        <span aria-hidden="true" className="flex-shrink-0 flex items-center">
          {leftIcon}
        </span>
      ) : null}

      {children}

      {!loading && rightIcon && (
        <span aria-hidden="true" className="flex-shrink-0 flex items-center">
          {rightIcon}
        </span>
      )}
    </button>
  );
}

export default Button;
export { Button };
