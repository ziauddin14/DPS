import { Clipboard, Clock, Play, CheckCircle2 } from 'lucide-react';
import StatsCard from './StatsCard';

/**
 * TaskStats component.
 * Displays 4 summary statistics cards for tasks, dynamically computed from tasks data.
 *
 * @param {Array} [tasks=[]] - Array of tasks objects.
 */
function TaskStats({ tasks = [] }) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;

  const stats = [
    {
      title: 'Total Tasks',
      value: String(total).padStart(2, '0'),
      icon: Clipboard,
      description: 'Tasks in your list',
      colorClass: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Pending',
      value: String(pending).padStart(2, '0'),
      icon: Clock,
      description: 'Awaiting start',
      colorClass: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'In Progress',
      value: String(inProgress).padStart(2, '0'),
      icon: Play,
      description: 'Currently working on',
      colorClass: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: 'Completed',
      value: String(completed).padStart(2, '0'),
      icon: CheckCircle2,
      description: 'Completed tasks',
      colorClass: 'text-emerald-600 bg-emerald-50',
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

export default TaskStats;
export { TaskStats };
