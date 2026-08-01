import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { PAGE_TITLES } from '../constants/navigation';

/**
 * MainLayout — the application shell wrapping every page.
 *
 * Manages:
 *   - Tablet sidebar collapsed state (icon-only at md breakpoint)
 *   - Mobile drawer open/close state
 *   - Derives the current page title from the route location
 *
 * Structure:
 *   <Sidebar />              (fixed left)
 *   <div>
 *     <Navbar />             (fixed top)
 *     <main>
 *       <Outlet />           (page content)
 *     </main>
 *   </div>
 */
function MainLayout() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Read sidebar collapsed state from localStorage (persists across reloads)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('dps-sidebar-collapsed') === 'true';
  });

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('dps-sidebar-collapsed', String(next));
      return next;
    });
  };

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'DPS';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* ── Main content area ────────────────────────────────────── */}
      {/*
        Offset the content to the right by the sidebar width.
          - md breakpoint (tablet) / collapsed (desktop): offset by 80px (w-20)
          - lg+ breakpoint (desktop expanded): offset by 256px (w-64)
          - <md (mobile): no offset (sidebar is an overlay)
      */}
      <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'md:ml-20' : 'md:ml-20 lg:ml-64'}`}>

        {/* Navbar */}
        <Navbar
          pageTitle={pageTitle}
          onMobileMenuToggle={() => setIsMobileOpen(true)}
        />

        {/* Page content — padded below the fixed navbar */}
        <main className="pt-[70px] min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
