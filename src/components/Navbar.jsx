import { useEffect, useState } from 'react';
import { Bell, Menu, Search, User } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

/**
 * Navbar component — fixed top bar shown above the page content.
 *
 * Contains:
 *   Left   : Hamburger menu (mobile) + dynamic page title
 *   Center : Search bar (UI only)
 *   Right  : Notification icon + live clock + profile avatar
 *
 * @param {string}   pageTitle          - Current page name derived from the route.
 * @param {Function} onMobileMenuToggle - Opens the mobile sidebar drawer.
 */
function Navbar({ pageTitle, onMobileMenuToggle }) {
  const { settings } = useSettings();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Tick clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const is12Hour = settings?.timeFormat !== '24-hour';
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: is12Hour,
  });

  return (
    <header className="fixed top-0 right-0 left-0 z-30 h-[70px] bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 shadow-sm flex items-center px-4 gap-4">

      {/* ── Left: Hamburger (mobile) + Page Title ────────────────── */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Hamburger — visible on mobile only */}
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Page title */}
        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* ── Center: Search Bar ─────────────────────────────────────── */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="search"
            placeholder="Search anything..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition"
            aria-label="Search"
            readOnly
          />
        </div>
      </div>

      {/* ── Right: Clock + Notifications + Avatar ─────────────────── */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
        {/* Live clock */}
        <time
          className="hidden sm:block text-sm font-mono font-medium text-slate-500 dark:text-slate-400 tabular-nums"
          aria-label="Current time"
        >
          {formattedTime}
        </time>

        {/* Notification icon (no functionality) */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" aria-hidden="true" />
          {/* Unread badge */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" aria-hidden="true" />
        </button>

        {/* Profile avatar (placeholder, no functionality) */}
        <button
          type="button"
          className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
          aria-label="Profile"
        >
          <User className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
