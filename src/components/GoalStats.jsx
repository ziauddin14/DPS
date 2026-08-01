import { Target, Clock, Compass, CheckCircle2 } from 'lucide-react';
import StatsCard from './StatsCard';

/**
 * GoalStats component.
 * Displays 4 summary statistics cards for goals, dynamically computed from goals data.
 *
 * @param {Array} [goals=[]] - Array of goals objects.
 */
function GoalStats({ goals = [] }) {
  const total = goals.length;
  const notStarted = goals.filter((g) => g.status === 'Not Started').length;
  const inProgress = goals.filter((g) => g.status === 'In Progress').length;
  const completed = goals.filter((g) => g.status === 'Completed').length;

  const stats = [
    {
      title: 'Total Goals',
      value: String(total).padStart(2, '0'),
      icon: Target,
      description: 'Goals in your dashboard',
      colorClass: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Not Started',
      value: String(notStarted).padStart(2, '0'),
      icon: Clock,
      description: 'Awaiting implementation',
      colorClass: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'In Progress',
      value: String(inProgress).padStart(2, '0'),
      icon: Compass,
      description: 'Currently striving for',
      colorClass: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: 'Completed',
      value: String(completed).padStart(2, '0'),
      icon: CheckCircle2,
      description: 'Achieved goals',
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

export default GoalStats;
export { GoalStats };
