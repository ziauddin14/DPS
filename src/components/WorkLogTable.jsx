import { Edit2, Trash2 } from 'lucide-react';
import { Button } from './ui';
import Badge from './ui/Badge';

/**
 * WorkLogTable component.
 * Displays work logs in a table with edit and delete actions.
 */
function WorkLogTable({ workLogs, onEdit, onDelete }) {
  const formatDuration = (minutes) => {
    if (!minutes) return '-';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Email': 'text-blue-600 bg-blue-50',
      'WhatsApp': 'text-green-600 bg-green-50',
      'Phone Call': 'text-purple-600 bg-purple-50',
      'Meeting': 'text-orange-600 bg-orange-50',
      'Documentation': 'text-cyan-600 bg-cyan-50',
      'Research': 'text-indigo-600 bg-indigo-50',
      'Development': 'text-rose-600 bg-rose-50',
      'Testing': 'text-amber-600 bg-amber-50',
      'Planning': 'text-teal-600 bg-teal-50',
      'Learning': 'text-pink-600 bg-pink-50',
      'Office Work': 'text-slate-600 bg-slate-50',
      'Deployment': 'text-emerald-600 bg-emerald-50',
      'Bug Fix': 'text-red-600 bg-red-50',
      'Support': 'text-violet-600 bg-violet-50',
      'Other': 'text-gray-600 bg-gray-50',
    };
    return colors[category] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Related Task
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Related Follow-up
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {workLogs.map((workLog) => (
              <tr
                key={workLog._id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                  {formatDate(workLog.activityDate)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-800 dark:text-slate-200 font-medium">
                  {workLog.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant="neutral"
                    className={getCategoryColor(workLog.category)}
                  >
                    {workLog.category}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                  {formatDuration(workLog.durationMinutes)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                  {workLog.relatedTask?.title || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                  {workLog.relatedFollowup ? (
                    <div className="max-w-xs truncate" title={`${workLog.relatedFollowup.personName} - ${workLog.relatedFollowup.subject}`}>
                      {workLog.relatedFollowup.personName}
                    </div>
                  ) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                  {workLog.department || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(workLog)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      aria-label="Edit work log"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(workLog)}
                      className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
                      aria-label="Delete work log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WorkLogTable;
export { WorkLogTable };
