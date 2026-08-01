import { Check, Edit2, Trash2, MessageCircle, ArrowRight } from 'lucide-react';
import { Badge, Button } from './ui';
import { useSettings } from '../context/SettingsContext';
import { formatDate } from '../utils/dateFormatter';
import { generateSingleTaskMessage, openWhatsApp } from '../utils/whatsappShare';

/**
 * TaskTable component - Professional table rendering for tasks
 */
function TaskTable({ tasks, onEdit, onToggleComplete, onDelete, onConvertToFollowup, onConvertToProject }) {
  const { settings } = useSettings();

  // Priority badge variants
  const priorityVariants = {
    High: 'danger',
    Medium: 'warning',
    Low: 'info',
  };

  // Status badge variants
  const statusVariants = {
    Pending: 'neutral',
    'In Progress': 'info',
    Completed: 'success',
  };

  // Department badge variants
  const departmentVariants = {
    ETD: 'info',
    NTD: 'warning',
  };

  // Get deadline color class
  const getDeadlineColor = (deadline) => {
    if (!deadline) return 'text-slate-400';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-rose-600 font-semibold'; // Overdue
    if (diffDays === 0) return 'text-amber-600 font-semibold'; // Today
    return 'text-emerald-600 font-semibold'; // Future
  };

  const handleWhatsAppShare = (task) => {
    const message = generateSingleTaskMessage(task, settings);
    openWhatsApp(message);
  };

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-12">
                <span className="sr-only">Select</span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Task Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Dependency
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Deadline
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => {
              const isCompleted = task.status === 'Completed' || task.completed;
              
              return (
                <tr
                  key={task._id}
                  className={`hover:bg-slate-50 transition-colors ${
                    isCompleted ? 'opacity-60' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onToggleComplete(task)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 hover:border-emerald-400'
                      }`}
                      aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                    </button>
                  </td>

                  {/* Task Title */}
                  <td className="px-4 py-4">
                    <div className="max-w-xs">
                      <p
                        className={`text-sm font-bold text-slate-800 truncate ${
                          isCompleted ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-1">
                        {task.description || 'No description'}
                      </p>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge
                      variant={departmentVariants[task.department] || 'neutral'}
                      className="text-[10px] uppercase tracking-wider"
                    >
                      {task.department || 'ETD'}
                    </Badge>
                  </td>

                  {/* Dependency */}
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(task.dependency) && task.dependency.length > 0 ? (
                        task.dependency.map((dep) => (
                          <Badge
                            key={dep}
                            variant="neutral"
                            className="bg-slate-15 border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider"
                          >
                            {dep}
                          </Badge>
                        ))
                      ) : (
                        <Badge
                          variant="neutral"
                          className="bg-slate-15 border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider"
                        >
                          None
                        </Badge>
                      )}
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge
                      variant={priorityVariants[task.priority] || 'neutral'}
                      className="text-[10px] uppercase tracking-wider"
                    >
                      {task.priority}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={statusVariants[task.status] || 'neutral'}
                        className="text-[10px] uppercase tracking-wider"
                      >
                        {task.status}
                      </Badge>
                      {task.convertedTo && (
                        <Badge variant="info" className="text-[10px] uppercase tracking-wider">
                          Converted → {task.convertedTo}
                        </Badge>
                      )}
                    </div>
                  </td>

                  {/* Deadline */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`text-xs ${getDeadlineColor(task.deadline)}`}>
                      {task.deadline
                        ? formatDate(task.deadline, settings?.dateFormat || 'YYYY-MM-DD')
                        : 'No deadline'}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-xs text-slate-400">
                      {formatDate(task.createdAt, settings?.dateFormat || 'YYYY-MM-DD')}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Convert Dropdown */}
                      {!task.convertedTo && (
                        <div className="relative group">
                          <button
                            type="button"
                            className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-1"
                            title="Convert task"
                            aria-label="Convert task"
                          >
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            <span className="text-xs font-medium">Convert</span>
                          </button>
                          {/* Dropdown Menu */}
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <button
                              type="button"
                              onClick={() => onConvertToFollowup && onConvertToFollowup(task)}
                              className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 rounded-t-lg transition-colors"
                            >
                              Convert to Follow-up
                            </button>
                            <button
                              type="button"
                              onClick={() => onConvertToProject && onConvertToProject(task)}
                              className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 rounded-b-lg transition-colors"
                            >
                              Convert to Project
                            </button>
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleWhatsAppShare(task)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Share on WhatsApp"
                        aria-label="Share on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(task)}
                        className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit task"
                        aria-label="Edit task"
                      >
                        <Edit2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(task)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete task"
                        aria-label="Delete task"
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

export default TaskTable;
export { TaskTable };
