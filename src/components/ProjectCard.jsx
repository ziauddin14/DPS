import { Calendar, Pencil, Trash2, Code2, Building2 } from 'lucide-react';
import { Badge } from './ui';
import { useSettings } from '../context/SettingsContext';
import { formatDate } from '../utils/dateFormatter';

// Static lookup maps — defined outside the component (no re-creation on each render)
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
 * ProjectCard component.
 * Displays a single project item with client, technologies, status/priority badges, progress and actions.
 *
 * @param {Object}   project   - Project data object.
 * @param {Function} onEdit    - Callback when edit button is clicked.
 * @param {Function} onDelete  - Callback when delete button is clicked.
 */
function ProjectCard({ project, onEdit, onDelete }) {
  const { settings } = useSettings();
  const isCompleted = project.status === 'Completed' || project.progress === 100;

  const priorityVariant = PRIORITY_VARIANTS[project.priority] || 'neutral';
  const statusVariant   = STATUS_VARIANTS[project.status]   || 'neutral';

  // Format dates using global settings
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
    <div
      className={`bg-white border rounded-2xl shadow-sm p-5 hover:shadow-md transition-all duration-200 ease-in-out flex flex-col justify-between h-full gap-4 group border-slate-100 ${
        isCompleted ? 'opacity-85' : ''
      }`}
    >
      {/* Top Section: Title & Description */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h4
              className={`text-base font-bold text-slate-800 tracking-tight leading-snug break-words ${
                isCompleted ? 'line-through text-slate-400' : ''
              }`}
            >
              {project.title}
            </h4>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <Badge
                variant="neutral"
                className="bg-slate-50 border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider"
              >
                {project.category || 'General'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        <p
          className={`text-sm font-medium text-slate-500 line-clamp-3 ${
            isCompleted ? 'text-slate-400' : ''
          }`}
        >
          {project.description || 'No description provided.'}
        </p>

        {/* Client */}
        {project.client && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Building2 className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span className="truncate">Client: <span className="text-slate-700">{project.client}</span></span>
          </div>
        )}

        {/* Technologies List */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Technologies</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Middle Section: Progress Bar */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Progress</span>
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

      {/* Bottom Section: Badges & Action Controls */}
      <div className="space-y-4 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Status & Priority badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={priorityVariant}>{project.priority}</Badge>
            <Badge variant={statusVariant}>{project.status}</Badge>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{dateRangeString}</span>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={() => onEdit && onEdit(project)}
            className="p-2 rounded-xl text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
            aria-label="Edit project"
          >
            <Pencil className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete && onDelete(project)}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300"
            aria-label="Delete project"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
export { ProjectCard };
