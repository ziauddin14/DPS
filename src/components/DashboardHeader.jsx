import { useState, useEffect } from 'react';
import { PageHeader } from './ui';
import { useSettings } from '../context/SettingsContext';
import { formatDate, formatTime } from '../utils/dateFormatter';

/**
 * Returns a time-of-day greeting string based on the current hour.
 * Defined outside the component so it is never recreated on render.
 *
 * @param {number} hour - Hour of the day (0-23).
 * @returns {string}
 */
function getGreeting(hour) {
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/**
 * DashboardHeader component.
 * Displays a dynamic greeting, today's full date, and a live ticking clock.
 */
function DashboardHeader() {
  const { settings } = useSettings();
  const [now, setNow] = useState(() => new Date());

  // Tick clock every second — cleanup on unmount
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const greeting = getGreeting(now.getHours());
  const userName = settings?.userName?.trim() || '';
  const designation = settings?.designation?.trim() || '';
  const company = settings?.company?.trim() || '';

  const title = userName ? `${greeting}, ${userName} 👋` : `${greeting} 👋`;
  
  let subtitle = undefined;
  if (designation) {
    subtitle = (
      <span>
        {designation}
        {company && <span className="block text-xs font-medium text-slate-400 mt-0.5">{company}</span>}
      </span>
    );
  }

  const formattedDate = formatDate(now, settings?.dateFormat);
  const formattedTime = formatTime(now, settings?.timeFormat);

  return (
    <PageHeader
      title={title}
      subtitle={subtitle}
      actions={
        <div className="flex sm:flex-col items-baseline sm:items-end gap-3 sm:gap-1 flex-shrink-0">
          {/* Dynamic Date */}
          <p className="text-sm font-semibold text-slate-600">
            Today:{' '}
            <span className="text-primary-600 font-mono">
              {formattedDate}
            </span>
          </p>
          {/* Live Clock */}
          <time
            className="text-lg sm:text-2xl font-bold text-slate-800 font-mono tracking-tight tabular-nums"
            aria-label={`Current time: ${formattedTime}`}
          >
            {formattedTime}
          </time>
        </div>
      }
    />
  );
}

export default DashboardHeader;
