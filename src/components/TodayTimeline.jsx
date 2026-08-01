import { Card } from './ui';
import { Calendar, PhoneCall, Gift, MapPin, Clock, CheckCircle2 } from 'lucide-react';

/**
 * TodayTimeline component.
 * Displays a sorted, unified list of today's events, follow-ups, and birthdays.
 *
 * @param {Array} todayTimeline - Array of timeline items.
 * @param {boolean} isLoading - Controls loading state.
 */
function TodayTimeline({ todayTimeline = [], isLoading = false }) {
  const items = Array.isArray(todayTimeline) ? todayTimeline : [];
  const isEmpty = items.length === 0;

  if (isLoading) {
    return (
      <Card title="Today's Timeline" subtitle="Timeline of today's schedule and tasks">
        <div className="space-y-6 h-[300px] flex flex-col justify-center animate-pulse px-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
              <div className="space-y-1.5 flex-1 pt-1">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Helper to resolve icon based on item type
  const getItemIcon = (type) => {
    switch (type) {
      case 'birthday':
        return {
          icon: Gift,
          color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50',
          badgeText: 'Birthday',
        };
      case 'followup':
        return {
          icon: PhoneCall,
          color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50',
          badgeText: 'Follow-up',
        };
      default:
        return {
          icon: Calendar,
          color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50',
          badgeText: 'Event',
        };
    }
  };

  return (
    <Card title="Today's Timeline" subtitle="Unified schedule and key updates for today">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-[300px] text-center px-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-full mb-3 text-emerald-500 border border-emerald-100/50 dark:border-emerald-900/30 shadow-inner">
            <CheckCircle2 className="w-10 h-10" aria-hidden="true" />
          </div>
          <h4 className="text-base font-bold text-slate-700 dark:text-slate-250">Today is clear 🎉</h4>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
            No events, follow-ups, or birthdays scheduled.
          </p>
        </div>
      ) : (
        <div className="relative pl-4 h-[300px] overflow-y-auto pr-2 space-y-5 scrollbar-thin">
          {/* Vertical timeline connector track */}
          <div 
            className="absolute left-8 top-2 bottom-6 w-0.5 bg-slate-100 dark:bg-slate-700" 
            aria-hidden="true"
          />

          {items.map((item, idx) => {
            const config = getItemIcon(item.type);
            const Icon = config.icon;

            return (
              <div 
                key={item._id || idx}
                className="flex items-start gap-4 relative group"
              >
                {/* Node icon */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border z-10 flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${config.color}`}>
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>

                {/* Content Block */}
                <div className="flex-1 min-w-0 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-slate-100/50 dark:border-slate-700/50 p-3.5 rounded-xl transition-all duration-200 hover:shadow-sm">
                  
                  {/* Top row: Title and Badge / Time */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-150 leading-snug truncate pr-2">
                      {item.title}
                    </h4>
                    {item.time && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono text-slate-400 dark:text-slate-500">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        {item.time}
                      </span>
                    )}
                  </div>

                  {/* Subtitle / Details row */}
                  {item.type === 'followup' ? (
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 truncate">
                      Contact: <span className="text-slate-700 dark:text-slate-300 font-bold">{item.personName}</span>
                    </p>
                  ) : item.location ? (
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-1 truncate">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-350" aria-hidden="true" />
                      <span>{item.location}</span>
                    </div>
                  ) : null}

                  {/* Extra item metadata description if present */}
                  {item.description && (
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1.5 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default TodayTimeline;
export { TodayTimeline };
