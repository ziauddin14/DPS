import { Gift } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { formatDate } from '../utils/dateFormatter';

/**
 * Computes the next calendar occurrence of an event date and days remaining.
 * Rolls over to next year if this year's date has already passed.
 *
 * @param {string|Date} startDate - Original event startDate.
 * @param {Date}        today     - Today's date (midnight, local).
 * @returns {{ nextDate: Date, daysRemaining: number }}
 */
function getNextOccurrence(startDate, today) {
  const eventDate = new Date(startDate);
  const currentYear = today.getFullYear();

  let nextDate = new Date(currentYear, eventDate.getMonth(), eventDate.getDate());
  if (nextDate < today) {
    // This year's date has passed — show next year's occurrence
    nextDate = new Date(currentYear + 1, eventDate.getMonth(), eventDate.getDate());
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.round((nextDate - today) / msPerDay);

  return { nextDate, daysRemaining };
}

/**
 * BirthdayReminder component.
 * Filters all events to type === 'Birthday', calculates days until the next
 * occurrence (wrapping to the next year when needed), and renders them
 * sorted by nearest upcoming date.
 *
 * Returns null when no birthday events exist — safe to render unconditionally.
 *
 * @param {Array} [events=[]] - Full array of event objects from the backend.
 */
function BirthdayReminder({ events = [] }) {
  const { settings } = useSettings();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const birthdays = events
    .filter((e) => e.type === 'Birthday')
    .map((e) => {
      const { nextDate, daysRemaining } = getNextOccurrence(e.startDate, today);
      return { ...e, nextDate, daysRemaining };
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  // Nothing to render if there are no birthday events
  if (birthdays.length === 0) return null;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4 h-full">

      {/* Section heading */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-rose-50 rounded-lg">
          <Gift className="w-4 h-4 text-rose-500" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Birthday Reminders
        </h3>
      </div>

      <ul className="space-y-2" aria-label="Birthday reminders list">
        {birthdays.map((event) => {
          const isToday = event.daysRemaining === 0;
          const isSoon  = event.daysRemaining > 0 && event.daysRemaining <= 7;

          // Badge styling based on urgency
          const badgeClass = isToday
            ? 'bg-rose-500 text-white'
            : isSoon
            ? 'bg-rose-100 text-rose-600'
            : 'bg-slate-100 text-slate-500';

          const badgeLabel = isToday
            ? '🎉 Today'
            : `${event.daysRemaining}d`;

          return (
            <li
              key={event._id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors duration-150"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {event.title}
                </p>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  {formatDate(event.nextDate, settings.dateFormat)}
                </p>
              </div>

              <span
                className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${badgeClass}`}
                aria-label={isToday ? 'Birthday is today' : `${event.daysRemaining} days remaining`}
              >
                {badgeLabel}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default BirthdayReminder;
export { BirthdayReminder };
