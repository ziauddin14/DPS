import { NavLink } from 'react-router-dom';

/**
 * NavigationItem — a single sidebar navigation link.
 * Highlights automatically when the route is active. Supports tooltip when collapsed.
 *
 * @param {string}   path        - Route path this item navigates to.
 * @param {string}   label       - Display label.
 * @param {React.FC} icon        - Lucide icon component.
 * @param {boolean}  isCollapsed - Icon-only mode for collapsed sidebar.
 * @param {Function} onClick     - Optional callback (e.g., close mobile drawer).
 */
function NavigationItem({ path, label, icon: Icon, isCollapsed, onClick }) {
  return (
    <NavLink
      to={path}
      end={path === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'flex items-center rounded-xl font-medium text-sm transition-all duration-150 ease-in-out group relative mx-3 py-2.5',
          isCollapsed ? 'justify-center px-0' : 'gap-3 px-3',
          isActive
            ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-200',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          {/* Active indicator bar */}
          {isActive && (
            <span className="absolute left-0 inset-y-0 w-1 rounded-full bg-primary-600 dark:bg-primary-500 my-1" />
          )}

          {/* Icon */}
          <Icon
            className={[
              'flex-shrink-0 w-5 h-5 transition-colors duration-150',
              isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300',
            ].join(' ')}
            aria-hidden="true"
          />

          {/* Label — hidden when collapsed */}
          {!isCollapsed && (
            <span className="truncate">{label}</span>
          )}

          {/* Tooltip — visible only on hover when collapsed */}
          {isCollapsed && (
            <span 
              className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-950 text-white text-xs font-semibold rounded-lg shadow-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-[9999] border border-slate-700/50"
              role="tooltip"
            >
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default NavigationItem;
export { NavigationItem };
