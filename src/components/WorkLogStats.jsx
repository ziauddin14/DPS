import { Clipboard, Calendar, Clock, TrendingUp, Activity } from 'lucide-react';
import StatsCard from './StatsCard';

/**
 * WorkLogStats component.
 * Displays 8 summary statistics cards for work logs, dynamically computed from work logs data.
 *
 * @param {Array} [workLogs=[]] - Array of work log objects.
 */
function WorkLogStats({ workLogs = [] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thisWeekStart = new Date(today);
  const dayOfWeek = today.getDay();
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  thisWeekStart.setDate(diff);

  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const totalActivities = workLogs.length;
  const todayActivities = workLogs.filter((w) => {
    const activityDate = new Date(w.activityDate);
    activityDate.setHours(0, 0, 0, 0);
    return activityDate.getTime() === today.getTime();
  }).length;

  const thisWeekActivities = workLogs.filter((w) => {
    const activityDate = new Date(w.activityDate);
    activityDate.setHours(0, 0, 0, 0);
    return activityDate >= thisWeekStart;
  }).length;

  const thisMonthActivities = workLogs.filter((w) => {
    const activityDate = new Date(w.activityDate);
    activityDate.setHours(0, 0, 0, 0);
    return activityDate >= thisMonthStart;
  }).length;

  const totalMinutes = workLogs.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalRemainingMinutes = totalMinutes % 60;

  const todayMinutes = workLogs
    .filter((w) => {
      const activityDate = new Date(w.activityDate);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate.getTime() === today.getTime();
    })
    .reduce((sum, w) => sum + (w.durationMinutes || 0), 0);

  const todayHours = Math.floor(todayMinutes / 60);
  const todayRemainingMinutes = todayMinutes % 60;

  // Productivity: (Today's Duration Minutes / 480) × 100, max 100%
  const workingDayMinutes = 480; // 8 hours
  const productivity = Math.min(Math.round((todayMinutes / workingDayMinutes) * 100), 100);

  const formatDuration = (hours, minutes) => {
    if (hours === 0 && minutes === 0) return '0h';
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const stats = [
    {
      title: 'Total Activities',
      value: String(totalActivities).padStart(2, '0'),
      icon: Clipboard,
      description: 'All recorded activities',
      colorClass: 'text-blue-600 bg-blue-50',
    },
    {
      title: "Today's Activities",
      value: String(todayActivities).padStart(2, '0'),
      icon: Calendar,
      description: 'Activities today',
      colorClass: 'text-green-600 bg-green-50',
    },
    {
      title: 'This Week',
      value: String(thisWeekActivities).padStart(2, '0'),
      icon: Clock,
      description: 'Activities this week',
      colorClass: 'text-purple-600 bg-purple-50',
    },
    {
      title: 'This Month',
      value: String(thisMonthActivities).padStart(2, '0'),
      icon: Activity,
      description: 'Activities this month',
      colorClass: 'text-orange-600 bg-orange-50',
    },
    {
      title: 'Total Hours',
      value: formatDuration(totalHours, totalRemainingMinutes),
      icon: Clock,
      description: 'Total time worked',
      colorClass: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: "Today's Hours",
      value: formatDuration(todayHours, todayRemainingMinutes),
      icon: Calendar,
      description: 'Time worked today',
      colorClass: 'text-teal-600 bg-teal-50',
    },
    {
      title: 'Productivity',
      value: `${productivity}%`,
      icon: TrendingUp,
      description: 'Daily productivity',
      colorClass: 'text-rose-600 bg-rose-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          description={stat.description}
          colorClass={stat.colorClass}
        />
      ))}
    </div>
  );
}

export default WorkLogStats;
export { WorkLogStats };
