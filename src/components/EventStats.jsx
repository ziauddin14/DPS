import { CalendarDays, Clock, CalendarCheck2, Bell } from 'lucide-react';
import StatsCard from './StatsCard';

/**
 * EventStats component.
 * Displays 4 summary statistics cards for calendar events,
 * dynamically computed from events data.
 *
 * @param {Array} [events=[]] - Array of event objects.
 */
function EventStats({ events = [] }) {
  const total = events.length;
  const meetings = events.filter((e) => e.type === 'Meeting').length;
  const birthdays = events.filter((e) => e.type === 'Birthday').length;
  const reminders = events.filter((e) => e.type === 'Reminder').length;

  const stats = [
    {
      title: 'Total Events',
      value: String(total).padStart(2, '0'),
      icon: CalendarDays,
      description: 'Events in your calendar',
      colorClass: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Meetings',
      value: String(meetings).padStart(2, '0'),
      icon: Clock,
      description: 'Scheduled meetings',
      colorClass: 'text-violet-600 bg-violet-50',
    },
    {
      title: 'Birthdays',
      value: String(birthdays).padStart(2, '0'),
      icon: CalendarCheck2,
      description: 'Upcoming birthdays',
      colorClass: 'text-rose-600 bg-rose-50',
    },
    {
      title: 'Reminders',
      value: String(reminders).padStart(2, '0'),
      icon: Bell,
      description: 'Active reminders',
      colorClass: 'text-amber-600 bg-amber-50',
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

export default EventStats;
export { EventStats };
