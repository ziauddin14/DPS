import { MapPin, Clock, Pencil, Trash2, Bell } from 'lucide-react';
import { Badge } from './ui';
import { useSettings } from '../context/SettingsContext';
import { formatDate } from '../utils/dateFormatter';

// Maps event type → badge variant for consistent colour coding
const TYPE_BADGE_VARIANTS = {
  Meeting: 'info',
  Event: 'success',
  Birthday: 'danger',
  Reminder: 'warning',
};

// Maps color label → Tailwind accent classes (border-left indicator)
const COLOR_ACCENT = {
  Blue:   'border-l-blue-400',
  Green:  'border-l-emerald-400',
  Red:    'border-l-rose-400',
  Purple: 'border-l-violet-400',
  Orange: 'border-l-orange-400',
  Pink:   'border-l-pink-400',
  Yellow: 'border-l-amber-400',
};

/**
 * EventCard component.
 * Displays a single calendar event with type, date/time, location,
 * reminder indicator and edit/delete action buttons.
 */
function EventCard({ event, onEdit, onDelete }) {
  const { settings } = useSettings();
  const typeVariant = TYPE_BADGE_VARIANTS[event.type] || 'neutral';
  const accentClass = COLOR_ACCENT[event.color] || 'border-l-slate-300';

  const formattedStartDate = event.startDate
    ? formatDate(event.startDate, settings.dateFormat)
    : 'No date';

  const formattedEndDate =
    event.endDate && event.endDate !== event.startDate
      ? formatDate(event.endDate, settings.dateFormat)
      : null;

  return (
    <div
      className={`bg-white border border-slate-100 border-l-4 ${accentClass} rounded-2xl shadow-sm p-5 hover:shadow-md transition-all duration-200 ease-in-out flex flex-col justify-between h-full gap-4 group`}
    >
      {/* Top: Type badge + Title */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1.5">
            <h4 className="text-base font-bold text-slate-800 tracking-tight leading-snug break-words">
              {event.title}
            </h4>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant={typeVariant}>{event.type}</Badge>
              {event.reminder && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider"
                  title="Reminder set"
                >
                  <Bell className="w-2.5 h-2.5" aria-hidden="true" />
                  Reminder
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-sm font-medium text-slate-500 line-clamp-2">
            {event.description}
          </p>
        )}
      </div>

      {/* Middle: Date / Time / Location */}
      <div className="space-y-1.5 text-xs font-semibold text-slate-400">
        {/* Date row */}
        <div className="flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <time dateTime={event.startDate}>
            {formattedStartDate}
            {formattedEndDate && ` – ${formattedEndDate}`}
          </time>
        </div>

        {/* Time row */}
        {event.time && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span>{event.time}</span>
          </div>
        )}

        {/* Location row */}
        {event.location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{event.location}</span>
          </div>
        )}
      </div>

      {/* Bottom: Actions */}
      <div className="pt-3 border-t border-slate-50 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onEdit && onEdit(event)}
          className="p-2 rounded-xl text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
          aria-label="Edit event"
        >
          <Pencil className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onDelete && onDelete(event)}
          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300"
          aria-label="Delete event"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default EventCard;
export { EventCard };
