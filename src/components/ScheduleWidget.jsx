import { Calendar, MapPin } from 'lucide-react';
import { Badge } from './ui';
import { useSettings } from '../context/SettingsContext';
import { formatDate, formatTime } from '../utils/dateFormatter';

const TYPE_COLORS = {
  Meeting:  'bg-blue-500',
  Event:    'bg-emerald-500',
  Birthday: 'bg-rose-500',
  Reminder: 'bg-amber-500',
};

const TYPE_BADGE_VARIANTS = {
  Meeting:  'info',
  Event:    'success',
  Birthday: 'danger',
  Reminder: 'warning',
};

/**
 * ScheduleWidget component.
 * Displays today's events or upcoming events from the live calendar API.
 * Supports skeleton loading states.
 */
function ScheduleWidget({ todayEvents = [], upcomingEvents = [], isLoading = false }) {
  const { settings } = useSettings();
  const hasEvents = todayEvents.length > 0 || upcomingEvents.length > 0;

  // Render Skeleton Loader rows
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="w-9 h-9 bg-slate-100 rounded-xl animate-pulse" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 bg-slate-100 rounded animate-pulse w-32" />
            <div className="h-3 bg-slate-100 rounded animate-pulse w-48" />
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-4 py-2">
              <div className="h-4 bg-slate-100 rounded animate-pulse w-16" />
              <div className="w-2.5 h-2.5 bg-slate-100 rounded-full animate-pulse flex-shrink-0" />
              <div className="h-4 bg-slate-100 rounded animate-pulse flex-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Determine list of events to show (prefer today's events, fallback to upcoming)
  const isShowingToday = todayEvents.length > 0;
  const eventsToShow = isShowingToday ? todayEvents : upcomingEvents;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow duration-200">
      
      {/* Header section */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
        <div className="p-2 bg-primary-50 rounded-xl text-primary-600">
          <Calendar className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            {isShowingToday ? "Today's Schedule" : 'Upcoming Schedule'}
          </h3>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            {isShowingToday ? 'Your events scheduled for today' : 'Next upcoming events'}
          </p>
        </div>
      </div>

      {/* Events List */}
      {!hasEvents ? (
        <div className="py-6 text-center">
          <p className="text-sm font-semibold text-slate-400">No events scheduled.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {eventsToShow.map((event, index) => {
            const isLast = index === eventsToShow.length - 1;
            const colorClass = TYPE_COLORS[event.type] || 'bg-slate-400';
            const badgeVariant = TYPE_BADGE_VARIANTS[event.type] || 'neutral';

            // Format event time/date string
            let displayTime = '';
            if (isShowingToday) {
              displayTime = event.time
                ? formatTime(event.time, settings.timeFormat)
                : event.startDate
                ? formatTime(new Date(event.startDate), settings.timeFormat)
                : '';
            } else {
              displayTime = event.startDate
                ? formatDate(event.startDate, settings.dateFormat)
                : '';
            }

            return (
              <div key={event._id}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 hover:translate-x-1 transition-all duration-200 ease-in-out group">
                  {/* Left: Time, status dot, title, location */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Time / Date */}
                    <time className="text-sm font-mono font-semibold text-slate-400 min-w-[72px] tabular-nums select-none flex-shrink-0">
                      {displayTime}
                    </time>

                    {/* Type Status Dot */}
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colorClass}`} aria-hidden="true" />

                    {/* Title & Location details */}
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors truncate block">
                        {event.title}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1 text-xs text-slate-450 text-slate-400 mt-0.5 truncate">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                          <span>{event.location}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Badge */}
                  <div className="flex-shrink-0 pl-11 sm:pl-0">
                    <Badge variant={badgeVariant}>{event.type}</Badge>
                  </div>
                </div>

                {!isLast && (
                  <div className="mx-3 border-b border-slate-100" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default ScheduleWidget;
export { ScheduleWidget };
