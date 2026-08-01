import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Logo component — shown at the top of the Sidebar.
 * Collapses to icon-only when the sidebar is in collapsed state.
 *
 * @param {boolean} isCollapsed - Whether the sidebar is in icon-only mode.
 */
function Logo({ isCollapsed }) {
  return (
    <Link
      to="/"
      className={`flex items-center group focus:outline-none py-5 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'}`}
      aria-label="Go to Dashboard"
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-md group-hover:shadow-primary-300 transition-shadow duration-200">
        <Brain className="w-5 h-5 text-white" aria-hidden="true" />
      </div>

      {/* Text — hidden when collapsed */}
      {!isCollapsed && (
        <div className="overflow-hidden">
          <p className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight tracking-tight">
            DPS
          </p>
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight whitespace-nowrap">
            Digital Personal Secretary
          </p>
        </div>
      )}
    </Link>
  );
}

export default Logo;
export { Logo };
