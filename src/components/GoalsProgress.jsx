import { useEffect, useState } from 'react';
import { Card } from './ui';
import { Target, Calendar, Award } from 'lucide-react';

/**
 * GoalsProgress component.
 * Displays three goal progress cards (Weekly, Monthly, Yearly) with animated progress bars.
 *
 * @param {Object} goalProgress - Object containing weekly, monthly, yearly stats: { completed, total }.
 * @param {boolean} isLoading - Controls loading skeleton state.
 */
function GoalsProgress({ goalProgress, isLoading = false }) {
  const [animate, setAnimate] = useState(false);

  // Trigger animation after mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const intervals = [
    {
      key: 'weekly',
      label: 'Weekly Goals',
      subtitle: 'Target for this week',
      icon: Calendar,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400',
      barColor: 'bg-gradient-to-r from-blue-400 to-blue-600',
      data: goalProgress?.weekly ?? { completed: 0, total: 0 },
    },
    {
      key: 'monthly',
      label: 'Monthly Goals',
      subtitle: 'Progress this month',
      icon: Target,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400',
      barColor: 'bg-gradient-to-r from-amber-400 to-amber-600',
      data: goalProgress?.monthly ?? { completed: 0, total: 0 },
    },
    {
      key: 'yearly',
      label: 'Yearly Goals',
      subtitle: 'Annual milestones progress',
      icon: Award,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400',
      barColor: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
      data: goalProgress?.yearly ?? { completed: 0, total: 0 },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 w-full h-full">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Card key={idx} className="flex-1">
            <div className="animate-pulse space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                <div className="space-y-1">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24" />
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-32" />
                </div>
              </div>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-8" />
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {intervals.map((interval) => {
        const Icon = interval.icon;
        const { completed, total } = interval.data;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return (
          <Card key={interval.key} className="flex-1 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              {/* Header: Icon, Label, and Description */}
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${interval.color}`}>
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                    {interval.label}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    {interval.subtitle}
                  </p>
                </div>
              </div>

              {/* Progress metrics */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>
                    Completed: <span className="font-bold text-slate-800 dark:text-slate-200">{completed}</span>
                    <span className="text-slate-350 mx-1">/</span>
                    {total}
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {percentage}%
                  </span>
                </div>

                {/* Progress bar wrapper */}
                <div
                  className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${interval.label} progress`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${interval.barColor}`}
                    style={{ width: animate ? `${percentage}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default GoalsProgress;
export { GoalsProgress };
