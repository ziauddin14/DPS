import { Calendar, Pencil, Trash2 } from 'lucide-react';
import { Badge } from './ui';
import { useSettings } from '../context/SettingsContext';
import { formatDate } from '../utils/dateFormatter';

/**
 * TaskCard component.
 * Displays a single task item with options to check, edit, or delete.
 *
 * @param {object} task - Task object containing metadata.
 */
function TaskCard({ task, onEdit, onToggleComplete, onDelete }) {
  const { settings } = useSettings();
  const isCompleted = task.status === 'Completed' || task.completed;

  // Custom priority mapping to Badge variants
  const priorityVariants = {
    High: 'danger',
    Medium: 'warning',
    Low: 'success',
  };

  const priorityVariant = priorityVariants[task.priority] || 'neutral';

  // Custom status mapping to Badge variants
  const statusVariants = {
    Pending: 'neutral',
    'In Progress': 'info',
    Completed: 'success',
  };

  const statusVariant = statusVariants[task.status] || 'neutral';

  // Department badge variant mapping
  const departmentVariants = {
    ETD: 'info',
    NTD: 'warning',
  };

  const departmentVariant = departmentVariants[task.department] || 'neutral';

  const formattedDeadline = task.deadline
    ? formatDate(task.deadline, settings?.dateFormat || 'YYYY-MM-DD')
    : 'No deadline';

  return (
    <div
      className={`bg-white border rounded-2xl shadow-sm p-5 hover:shadow-md transition-all duration-200 ease-in-out flex flex-col justify-between h-full gap-4 group ${
        isCompleted ? 'border-slate-100 opacity-75' : 'border-slate-100'
      }`}
    >
      {/* Top Part: Checkbox + Title + Description */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggleComplete && onToggleComplete(task)}
            className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0 mt-0.5 cursor-pointer flex-shrink-0"
            aria-label={`Mark "${task.title}" as completed`}
          />
          <div className="min-w-0 flex-1">
            <h4
              className={`text-base font-bold text-slate-800 tracking-tight leading-snug break-words ${
                isCompleted ? 'line-through text-slate-400' : ''
              }`}
            >
              {task.title}
            </h4>
            <div className="flex items-center gap-1.5 mt-1">
              <Badge
                variant={departmentVariant}
                className="text-[10px] uppercase tracking-wider"
              >
                {task.department || 'ETD'}
              </Badge>
              <Badge
                variant="neutral"
                className="bg-slate-15 border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider"
              >
                {task.dependency || 'IT'}
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
          {task.description || 'No description provided.'}
        </p>
      </div>

      {/* Bottom Part: Badges + Action Buttons */}
      <div className="space-y-4 pt-3 border-t border-slate-50">
        {/* Badges and Deadline */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Status and Priority badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={priorityVariant}>{task.priority}</Badge>
            <Badge variant={statusVariant}>{task.status}</Badge>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            <time dateTime={task.deadline || undefined}>{formattedDeadline}</time>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit && onEdit(task)}
            className="p-2 rounded-xl text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
            aria-label="Edit task"
          >
            <Pencil className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete && onDelete(task)}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
export { TaskCard };
