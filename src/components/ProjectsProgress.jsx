import { Card, Badge } from './ui';
import { Briefcase } from 'lucide-react';

/**
 * ProjectsProgress component.
 * Displays a list of active projects with progress details, priorities, and status badges.
 *
 * @param {Array} activeProjects - List of active projects.
 * @param {boolean} isLoading - Controls loading state.
 */
function ProjectsProgress({ activeProjects = [], isLoading = false }) {
  const projects = Array.isArray(activeProjects) ? activeProjects : [];
  const isEmpty = projects.length === 0;

  if (isLoading) {
    return (
      <Card title="Active Projects" subtitle="Progress overview of active projects">
        <div className="space-y-4 h-[300px] flex flex-col justify-center animate-pulse">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="p-4 border border-slate-100 dark:border-slate-700 rounded-xl space-y-3 bg-slate-50/20">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-slate-200 dark:bg-slate-750 rounded w-1/3" />
                <div className="h-5 bg-slate-200 dark:bg-slate-750 rounded w-16" />
              </div>
              <div className="h-2.5 bg-slate-200 dark:bg-slate-750 rounded w-1/4" />
              <div className="w-full bg-slate-200 dark:bg-slate-750 h-2 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Priority mapping to Badge variant
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'High':
        return 'danger';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'neutral';
    }
  };

  // Status mapping to Badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'info';
      case 'On Hold':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <Card title="Active Projects" subtitle="Ongoing projects and milestones tracking">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-[300px] text-center px-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-full mb-3 text-slate-350 dark:text-slate-500">
            <Briefcase className="w-10 h-10" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">No active projects found.</p>
        </div>
      ) : (
        <div className="h-[300px] overflow-y-auto space-y-3.5 pr-2 scrollbar-thin">
          {projects.map((project) => {
            const isCompleted = project.status === 'Completed';

            return (
              <div
                key={project._id}
                className="p-4 border border-slate-100 dark:border-slate-700/60 rounded-xl bg-slate-50/30 dark:bg-slate-800/20 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm transition-all duration-200"
              >
                {/* Header row: Title + Priority/Status badges */}
                <div className="flex flex-wrap items-start justify-between gap-3 min-w-0">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 tracking-tight truncate">
                      {project.title}
                    </h4>
                    {/* Show Department (represented by category/department) */}
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mt-0.5">
                      Dept: {project.category || 'General'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Badge variant={getPriorityVariant(project.priority)}>
                      {project.priority}
                    </Badge>
                    <Badge variant={getStatusVariant(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </div>

                {/* Progress bar info */}
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-455">
                    <span>Progress</span>
                    <span className={isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary-600 dark:text-primary-400'}>
                      {project.progress}%
                    </span>
                  </div>

                  {/* Progress bar slider container */}
                  <div
                    className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={project.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${project.title} progress`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                        isCompleted
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                          : 'bg-gradient-to-r from-primary-400 to-primary-600'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default ProjectsProgress;
export { ProjectsProgress };
