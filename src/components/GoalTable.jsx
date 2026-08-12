import { Edit2, Trash2, Calendar } from 'lucide-react';
import { Badge, Button } from './ui';
import { useSettings } from '../context/SettingsContext';
import { formatDate } from '../utils/dateFormatter';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';

/**
 * GoalTable component - Professional table rendering for goals
 */
function GoalTable({ goals, onEdit, onDelete }) {
  const { settings } = useSettings();
  const tableRef = useHorizontalScroll();

  // Priority badge variants
  const priorityVariants = {
    High: 'danger',
    Medium: 'warning',
    Low: 'success',
  };

  // Status badge variants
  const statusVariants = {
    'Not Started': 'neutral',
    'In Progress': 'info',
    Completed: 'success',
    'On Hold': 'warning',
  };

  if (goals.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto" ref={tableRef} tabIndex={0}>
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Goal Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Type
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
                Target Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {goals.map((goal) => {
              const isCompleted = goal.status === 'Completed' || goal.progress === 100;
              
              return (
                <tr
                  key={goal._id}
                  className={`hover:bg-slate-50 transition-colors ${
                    isCompleted ? 'opacity-60' : ''
                  }`}
                >
                  {/* Title */}
                  <td className="px-4 py-4">
                    <div className="max-w-xs">
                      <div className={`text-sm font-medium text-slate-900 ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                        {goal.title}
                      </div>
                      {goal.description && (
                        <div className="text-xs text-slate-500 truncate mt-1">
                          {goal.description}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge
                      variant="neutral"
                      className="bg-slate-15 border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider"
                    >
                      {goal.category || 'General'}
                    </Badge>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-xs font-bold text-slate-400 px-2 py-0.5 border border-slate-100 rounded bg-slate-50 uppercase tracking-wider">
                      {goal.type}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge
                      variant={priorityVariants[goal.priority] || 'neutral'}
                      className="text-[10px] uppercase tracking-wider"
                    >
                      {goal.priority}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge
                      variant={statusVariants[goal.status] || 'neutral'}
                      className="text-[10px] uppercase tracking-wider"
                    >
                      {goal.status}
                    </Badge>
                  </td>

                  {/* Progress */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="w-32">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
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
                  </td>

                  {/* Target Date */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      <time dateTime={goal.targetDate || undefined}>
                        {goal.targetDate ? formatDate(goal.targetDate, settings.dateFormat) : 'No target date'}
                      </time>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(goal);
                        }}
                        className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit goal"
                        aria-label="Edit goal"
                      >
                        <Edit2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(goal);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete goal"
                        aria-label="Delete goal"
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

export default GoalTable;
export { GoalTable };
