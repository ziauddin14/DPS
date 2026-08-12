import { Edit2, Trash2, Calendar, Code2, Building2 } from 'lucide-react';
import { Badge, Button } from './ui';
import { useSettings } from '../context/SettingsContext';
import { formatDate } from '../utils/dateFormatter';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';

// Static lookup maps
const PRIORITY_VARIANTS = {
  High:   'danger',
  Medium: 'warning',
  Low:    'success',
};

const STATUS_VARIANTS = {
  Planning:    'neutral',
  'In Progress': 'info',
  Completed:   'success',
  'On Hold':   'warning',
};

/**
 * ProjectTable component - Professional table rendering for projects
 */
function ProjectTable({ projects, onEdit, onDelete }) {
  const { settings } = useSettings();
  const tableRef = useHorizontalScroll();

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto" ref={tableRef} tabIndex={0}>
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Project Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Technologies
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Timeline
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((project) => {
              const isCompleted = project.status === 'Completed' || project.progress === 100;
              const priorityVariant = PRIORITY_VARIANTS[project.priority] || 'neutral';
              const statusVariant = STATUS_VARIANTS[project.status] || 'neutral';

              const formattedStartDate = project.startDate
                ? formatDate(project.startDate, settings.dateFormat)
                : '';
              const formattedDeadline = project.deadline
                ? formatDate(project.deadline, settings.dateFormat)
                : '';
              const dateRangeString = formattedStartDate && formattedDeadline
                ? `${formattedStartDate} - ${formattedDeadline}`
                : formattedDeadline || 'No deadline';

              return (
                <tr
                  key={project._id}
                  className={`hover:bg-slate-50 transition-colors ${
                    isCompleted ? 'opacity-60' : ''
                  }`}
                >
                  {/* Title */}
                  <td className="px-4 py-4">
                    <div className="max-w-xs">
                      <div className={`text-sm font-medium text-slate-900 ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                        {project.title}
                      </div>
                      {project.description && (
                        <div className="text-xs text-slate-500 truncate mt-1">
                          {project.description}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge
                      variant="neutral"
                      className="bg-slate-50 border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider"
                    >
                      {project.category || 'General'}
                    </Badge>
                  </td>

                  {/* Client */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {project.client ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                        <span className="truncate">{project.client}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>

                  {/* Technologies */}
                  <td className="px-4 py-4">
                    {project.technologies && project.technologies.length > 0 ? (
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge
                      variant={priorityVariant}
                      className="text-[10px] uppercase tracking-wider"
                    >
                      {project.priority}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge
                      variant={statusVariant}
                      className="text-[10px] uppercase tracking-wider"
                    >
                      {project.status}
                    </Badge>
                  </td>

                  {/* Progress */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="w-32">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                        <span className={isCompleted ? 'text-emerald-600' : 'text-primary-600'}>
                          {project.progress}%
                        </span>
                      </div>
                      <div
                        className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"
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
                  </td>

                  {/* Timeline */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      <span className="truncate">{dateRangeString}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(project);
                        }}
                        className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit project"
                        aria-label="Edit project"
                      >
                        <Edit2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(project);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete project"
                        aria-label="Delete project"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProjectTable;
export { ProjectTable };
