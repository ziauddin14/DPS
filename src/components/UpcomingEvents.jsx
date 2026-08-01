import { CalendarDays, Clock } from 'lucide-react';
import { Badge } from './ui';
import { useSettings } from '../context/SettingsContext';
import { formatDate, formatTime } from '../utils/dateFormatter';

// Static type → badge variant mapping (outside component — no re-creation on render)
const TYPE_BADGE_VARIANTS = {
  Meeting:  'info',
  Event:    'success',
  Birthday: 'danger',
  Reminder: 'warning',
};

// Maximum items to display in the panel
const MAX_UPCOMING = 5;

/**
 * UpcomingEvents component.
 * Receives the full events array and displays the next MAX_UPCOMING events
 * whose startDate is today or in the future, sorted nearest-first.
 *
 * @param {Array} [events=[]] - Full array of event objects from the backend.
 */
function UpcomingEvents({ events = [] }) {
  const { settings } = useSettings();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = events
    .filter((e) => new Date(e.startDate) >= today)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, MAX_UPCOMING);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4 h-full">

      {/* Section heading */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-primary-50 rounded-lg">
          <CalendarDays className="w-4 h-4 text-primary-500" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Upcoming Events
        </h3>
      </div>

      {upcoming.length === 0 ? (
        /* Inline mini-empty state — not using the full-page EmptyState intentionally */
        <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
          <div className="p-3 bg-slate-50 rounded-full">
            <CalendarDays className="w-6 h-6 text-slate-300" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold text-slate-400">No upcoming events</p>
        </div>
      ) : (
        <ul className="space-y-2" aria-label="Upcoming events list">
          {upcoming.map((event) => (
            <li
              key={event._id}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-150"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {event.title}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-slate-400">
                    {formatDate(event.startDate, settings.dateFormat)}
                  </span>
                  {event.time && (
                    <>
                      <span className="text-slate-300" aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        {formatTime(event.time, settings.timeFormat)}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Badge variant={TYPE_BADGE_VARIANTS[event.type] || 'neutral'}>
                {event.type}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UpcomingEvents;
export { UpcomingEvents };
