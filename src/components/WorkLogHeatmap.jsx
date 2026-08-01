import { useState } from 'react';
import { Card } from './ui';
import { Flame } from 'lucide-react';

/**
 * WorkLogHeatmap component.
 * Renders a GitHub-style contribution grid of the last 28 days with streak metrics.
 *
 * @param {Array} dailyHeatmap - Array of 28 objects: { date: string, count: number, minutes: number }.
 * @param {number} streak - Current consecutive activity streak count.
 * @param {boolean} isLoading - Controls loading state.
 */
function WorkLogHeatmap({ dailyHeatmap = [], streak = 0, isLoading = false }) {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const data = Array.isArray(dailyHeatmap) ? dailyHeatmap : [];
  const activeStreak = streak ?? 0;

  if (isLoading) {
    return (
      <Card title="Activity Heatmap" subtitle="Work activity over the last 28 days">
        <div className="flex flex-col animate-pulse space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20" />
          </div>
          <div className="grid grid-rows-4 grid-flow-col gap-2 justify-center">
            {Array.from({ length: 28 }).map((_, idx) => (
              <div key={idx} className="w-5 h-5 bg-slate-100 dark:bg-slate-800 rounded-sm" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Get color intensity class based on duration minutes
  const getIntensityClass = (minutes) => {
    if (!minutes || minutes <= 0) return 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700';
    if (minutes <= 60) return 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 border border-blue-200/20 hover:bg-blue-200/80 dark:hover:bg-blue-900/60';
    if (minutes <= 180) return 'bg-blue-300 dark:bg-blue-700/60 hover:bg-blue-400 dark:hover:bg-blue-700/80';
    if (minutes <= 300) return 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500';
    return 'bg-blue-700 dark:bg-blue-400 hover:bg-blue-800 dark:hover:bg-blue-350';
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top - 40,
    });
  };

  // Convert minutes to a formatted hours/minutes string
  const formatMins = (mins) => {
    if (!mins) return '0 hours';
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    if (hrs > 0 && m > 0) return `${hrs}h ${m}m`;
    if (hrs > 0) return `${hrs} ${hrs === 1 ? 'hour' : 'hours'}`;
    return `${m} mins`;
  };

  return (
    <Card 
      title="Activity Heatmap" 
      subtitle="Work activity over the last 28 days"
      actions={
        <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 rounded-full text-xs font-bold shadow-sm select-none">
          <Flame className="w-3.5 h-3.5 fill-rose-500 animate-pulse" aria-hidden="true" />
          <span>{activeStreak} Day Streak</span>
        </div>
      }
      className="relative"
    >
      <div className="relative flex flex-col w-full select-none">

        {/* Heatmap Grid */}
        <div className="grid grid-rows-4 grid-flow-col gap-2 justify-center relative">
          {data.map((day, idx) => {
            const dateObj = new Date(day.date);
            const dateFormatted = dateObj.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={day.date}
                onMouseEnter={() => setHoveredDay({ ...day, formattedDate: dateFormatted })}
                onMouseLeave={() => setHoveredDay(null)}
                onMouseMove={handleMouseMove}
                className={`w-6 h-6 rounded-md cursor-pointer transition-all duration-150 ${getIntensityClass(day.minutes)}`}
                role="gridcell"
                aria-label={`Activity on ${dateFormatted}: ${day.count} entries, ${formatMins(day.minutes)}`}
              />
            );
          })}
        </div>

        {/* Floating Custom Tooltip */}
        {hoveredDay && (
          <div
            className="absolute bg-slate-900 dark:bg-slate-950 text-white px-3 py-2 rounded-lg shadow-xl text-xs font-semibold pointer-events-none z-50 flex flex-col gap-0.5 border border-slate-700/50 min-w-[140px]"
            style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
          >
            <span className="text-slate-400 text-[10px] font-bold">{hoveredDay.formattedDate}</span>
            <span className="font-bold text-white text-sm">{formatMins(hoveredDay.minutes)}</span>
            <span className="text-slate-400 text-[10px]">{hoveredDay.count} {hoveredDay.count === 1 ? 'entry' : 'entries'}</span>
          </div>
        )}

        {/* Heatmap Legend */}
        <div className="flex justify-center items-center gap-1.5 mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Less</span>
          <div className="w-3.5 h-3.5 rounded bg-slate-100 dark:bg-slate-800/80" />
          <div className="w-3.5 h-3.5 rounded bg-blue-100 dark:bg-blue-900/40" />
          <div className="w-3.5 h-3.5 rounded bg-blue-300 dark:bg-blue-750" />
          <div className="w-3.5 h-3.5 rounded bg-blue-500 dark:bg-blue-600" />
          <div className="w-3.5 h-3.5 rounded bg-blue-700 dark:bg-blue-400" />
          <span>More</span>
        </div>

      </div>
    </Card>
  );
}

export default WorkLogHeatmap;
export { WorkLogHeatmap };
