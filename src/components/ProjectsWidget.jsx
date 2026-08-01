import { Briefcase, Calendar } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { formatDate } from '../utils/dateFormatter';

/**
 * ProjectsWidget component.
 * Displays live active projects with progress percentages, status badges, and deadlines.
 */
function ProjectsWidget({ projects = [], isLoading = false }) {
  const { settings } = useSettings();
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
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="p-4 border border-slate-100 rounded-xl bg-slate-50/20 space-y-3">
              <div className="flex justify-between items-center gap-4">
                <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2" />
                <div className="h-5 bg-slate-100 rounded-full animate-pulse w-16" />
              </div>
              <div className="h-3 bg-slate-100 rounded animate-pulse w-1/4" />
              <div className="w-full bg-slate-100 h-2 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow duration-200">
      
      {/* Header section */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
        <div className="p-2 bg-primary-50 rounded-xl text-primary-600">
          <Briefcase className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            Current Projects
          </h3>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            Projects currently in progress
          </p>
        </div>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-sm font-semibold text-slate-400">No active projects found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const isCompleted = project.status === 'Completed';

            // Format deadline date string using global settings
            const formattedDeadline = project.deadline
              ? formatDate(project.deadline, settings.dateFormat)
              : '';

            return (
              <div
                key={project._id}
                className="p-4 border border-slate-100 rounded-xl bg-slate-50/40 hover:border-slate-200 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 ease-in-out space-y-3"
              >
                {/* Top row: Title + Status Badge */}
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-sm font-bold text-slate-700 tracking-tight truncate">
                    {project.title}
                  </h4>
                  <span
                    className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Subtitle row: Progress label and Deadline */}
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1">
                    <span>Progress:</span>
                    <span className={isCompleted ? 'text-emerald-600' : 'text-primary-600'}>
                      {project.progress}%
                    </span>
                  </div>
                  {formattedDeadline && (
                    <div className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{formattedDeadline}</span>
                    </div>
                  )}
                </div>

                {/* Progress bar wrapper */}
                <div
                  className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={project.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${project.title} progress`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      isCompleted
                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                        : 'bg-gradient-to-r from-primary-400 to-primary-600'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default ProjectsWidget;
export { ProjectsWidget };
