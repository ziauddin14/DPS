import { X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Logo from './Logo';
import NavigationItem from './NavigationItem';
import { NAV_ITEMS } from '../constants/navigation';

/**
 * Sidebar component.
 *
 * Behaviour by breakpoint:
 *   - lg+ (Desktop)  : Toggleable between w-64 (expanded) and w-20 (collapsed).
 *   - md  (Tablet)   : Fixed w-20, icons only (collapsed).
 *   - <md (Mobile)   : Hidden, rendered as sliding overlay drawer (always expanded width).
 *
 * @param {boolean}  isCollapsed      - Sidebar collapsed state (icons only).
 * @param {Function} onToggleCollapse - Callback to toggle collapsed state.
 * @param {boolean}  isMobileOpen     - Mobile drawer open state.
 * @param {Function} onMobileClose    - Callback to close mobile drawer.
 */
function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onMobileClose }) {
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo & Toggle */}
      <div className={`flex-shrink-0 border-b border-slate-100 dark:border-slate-700 flex items-center ${isCollapsed ? 'flex-col gap-2 py-4' : 'justify-between pr-4'}`}>
        <Logo isCollapsed={isCollapsed} />
        
        {/* Collapse toggle button - hidden on mobile drawer, visible on md+ */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`hidden md:flex p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-205 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all focus:outline-none ${isCollapsed ? 'mx-auto' : ''}`}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4.5 h-4.5" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="w-4.5 h-4.5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {/* Navigation items */}
      <nav className={`flex-1 ${isCollapsed ? 'overflow-y-visible' : 'overflow-y-auto'} py-4 space-y-1`} aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <NavigationItem
            key={item.path}
            path={item.path}
            label={item.label}
            icon={item.icon}
            isCollapsed={isCollapsed}
            onClick={isMobileOpen ? onMobileClose : undefined}
          />
        ))}
      </nav>

      {/* Bottom divider */}
      <div className="flex-shrink-0 border-t border-slate-100 dark:border-slate-700 py-3">
        {!isCollapsed ? (
          <p className="text-[10px] text-slate-400 dark:text-slate-505 text-center px-4 select-none">
            © 2025 DPS — Your AI Secretary
          </p>
        ) : (
          <div className="flex justify-center">
            <span className="w-4 h-0.5 bg-slate-200 dark:bg-slate-600 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop / Tablet: fixed sidebar ────────────────────── */}
      <aside
        className={[
          'hidden md:flex flex-col fixed inset-y-0 left-0 z-40',
          'bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 shadow-sm',
          'transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-20 lg:w-64',
        ].join(' ')}
        aria-label="Sidebar"
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile: overlay drawer ──────────────────────────────── */}
      {/* Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <aside
        className={[
          'flex md:hidden flex-col fixed inset-y-0 left-0 z-50',
          'w-[250px] bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 shadow-xl',
          'transition-transform duration-300 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        aria-label="Mobile sidebar"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onMobileClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        {sidebarContent}
      </aside>
    </>
  );
}

export default Sidebar;
export { Sidebar };
