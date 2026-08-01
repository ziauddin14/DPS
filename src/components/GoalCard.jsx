import { Calendar, Pencil, Trash2 } from 'lucide-react';
import { Badge } from './ui';
import { useSettings } from '../context/SettingsContext';
import { formatDate } from '../utils/dateFormatter';

/**
 * GoalCard component.
 * Displays a single goal item with progress bar, target date, priority/status badges, and actions.
 */
function GoalCard({ goal, onEdit, onDelete }) {
  const { settings } = useSettings();
  const isCompleted = goal.status === 'Completed' || goal.progress === 100;

  // Custom priority mapping to Badge variants
  const priorityVariants = {
    High: 'danger',
    Medium: 'warning',
    Low: 'success',
  };
  const priorityVariant = priorityVariants[goal.priority] || 'neutral';

  // Custom status mapping to Badge variants
  const statusVariants = {
    'Not Started': 'neutral',
    'In Progress': 'info',
    Completed: 'success',
    'On Hold': 'warning',
  };
  const statusVariant = statusVariants[goal.status] || 'neutral';

  const formattedTargetDate = goal.targetDate
    ? formatDate(goal.targetDate, settings.dateFormat)
    : 'No target date';

  return (
    <div
      className={`bg-white border rounded-2xl shadow-sm p-5 hover:shadow-md transition-all duration-200 ease-in-out flex flex-col justify-between h-full gap-4 group border-slate-100 ${
        isCompleted ? 'opacity-85' : ''
      }`}
    >
      {/* Top Part: Title, Category, Description */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h4
              className={`text-base font-bold text-slate-800 tracking-tight leading-snug break-words ${
                isCompleted ? 'line-through text-slate-400' : ''
              }`}
            >
              {goal.title}
            </h4>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <Badge
                variant="neutral"
                className="bg-slate-15 border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider"
              >
                {goal.category || 'General'}
              </Badge>
              <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 border border-slate-100 rounded bg-slate-50 uppercase tracking-wider">
                {goal.type}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p
          className={`text-sm font-medium text-slate-500 line-clamp-3 ${
            isCompleted ? 'text-slate-400' : ''
          }`}
        >
          {goal.description || 'No description provided.'}
        </p>
      </div>

      {/* Middle Part: Progress */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Progress</span>
          <span className={isCompleted ? 'text-emerald-600' : 'text-primary-600'}>
            {goal.progress}%
          </span>
        </div>
        <div
          className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={goal.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${goal.title} progress`}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                : 'bg-gradient-to-r from-primary-400 to-primary-600'
            }`}
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Part: Badges + Action Buttons */}
      <div className="space-y-4 pt-3 border-t border-slate-50">
        {/* Badges and Deadline */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Status and Priority badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={priorityVariant}>{goal.priority}</Badge>
            <Badge variant={statusVariant}>{goal.status}</Badge>
          </div>

          {/* Target Date */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            <time dateTime={goal.targetDate || undefined}>{formattedTargetDate}</time>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit && onEdit(goal)}
            className="p-2 rounded-xl text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
            aria-label="Edit goal"
          >
            <Pencil className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete && onDelete(goal)}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300"
            aria-label="Delete goal"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoalCard;
export { GoalCard };
