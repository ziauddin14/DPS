import { Briefcase, ClipboardList, Compass, CheckCircle2 } from 'lucide-react';
import StatsCard from './StatsCard';

/**
 * ProjectStats component.
 * Displays summary cards for projects, dynamically computed from the projects array.
 *
 * @param {Array} [projects=[]] - Array of project objects.
 */
function ProjectStats({ projects = [] }) {
  const total = projects.length;
  const planning = projects.filter((p) => p.status === 'Planning').length;
  const inProgress = projects.filter((p) => p.status === 'In Progress').length;
  const completed = projects.filter((p) => p.status === 'Completed').length;

  const stats = [
    {
      title: 'Total Projects',
      value: String(total).padStart(2, '0'),
      icon: Briefcase,
      description: 'Active project portfolios',
      colorClass: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Planning',
      value: String(planning).padStart(2, '0'),
      icon: ClipboardList,
      description: 'In planning phase',
      colorClass: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'In Progress',
      value: String(inProgress).padStart(2, '0'),
      icon: Compass,
      description: 'Active execution phase',
      colorClass: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: 'Completed',
      value: String(completed).padStart(2, '0'),
      icon: CheckCircle2,
      description: 'Successfully delivered',
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

export default ProjectStats;
export { ProjectStats };
