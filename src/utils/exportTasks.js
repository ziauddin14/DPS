import { exportToPDF as sharedExportPDF, exportToExcel as sharedExportExcel, exportToCSV as sharedExportCSV } from './exportShared.js';
import { formatDate } from './dateFormatter.js';
import { getReportTranslation } from './translations/index.js';

/**
 * Export tasks as PDF
 * @param {Array} tasks - List of task objects
 * @param {Object} settings - User settings
 * @param {string} statusFilter - Applied status filter ('All', 'Pending', 'In Progress', 'Completed', 'Overdue')
 * @param {string} [lang='en'] - Language code ('en' | 'ur')
 */
export function exportToPDF(tasks, settings, statusFilter = 'All', lang = 'en') {
  const t = getReportTranslation(lang);

  const translatePriority = (priority) => {
    if (priority === 'High') return t.priorityHigh;
    if (priority === 'Medium') return t.priorityMedium;
    if (priority === 'Low') return t.priorityLow;
    return priority || '-';
  };

  const translateStatus = (status) => {
    if (status === 'Pending') return t.statusPending;
    if (status === 'In Progress') return t.statusInProgress;
    if (status === 'Completed') return t.statusCompleted;
    return status || '-';
  };

  // Determine title based on status filter
  let reportTitle;
  switch (statusFilter) {
    case 'Completed':
      reportTitle = t.completedTasksReport;
      break;
    case 'Pending':
      reportTitle = t.pendingTasksReport;
      break;
    case 'In Progress':
      reportTitle = t.inProgressTasksReport;
      break;
    case 'Overdue':
      reportTitle = t.overdueTasksReport;
      break;
    case 'All':
    default:
      reportTitle = t.allTasksReport;
      break;
  }

  return sharedExportPDF(tasks, {
    title: reportTitle,
    columns: [t.colTitle, t.colDescription, t.colPriority, t.colStatus, t.colDepartment, t.colDependency, t.colDeadline],
    mapRow: (task) => [
      task.title,
      task.description || '-',
      translatePriority(task.priority),
      translateStatus(task.status),
      task.department || 'ETD',
      Array.isArray(task.dependency) ? task.dependency.join(', ') : (task.dependency || t.none),
      task.deadline ? formatDate(task.deadline, settings?.dateFormat || 'YYYY-MM-DD') : t.noDeadline
    ],
    prefix: 'tasks',
    useLandscape: true,
    totalLabel: t.totalTasks,
    lang
  });
}

/**
 * Export tasks as Excel (.xlsx)
 */
export function exportToExcel(tasks) {
  return sharedExportExcel(tasks, {
    columns: ['Title', 'Description', 'Department', 'Dependency', 'Priority', 'Status', 'Deadline', 'Created At'],
    mapRow: (task) => [
      task.title,
      task.description || '',
      task.department || 'ETD',
      Array.isArray(task.dependency) ? task.dependency.join(', ') : (task.dependency || 'None'),
      task.priority,
      task.status,
      task.deadline ? formatDate(task.deadline, 'YYYY-MM-DD') : 'No deadline',
      task.createdAt ? formatDate(task.createdAt, 'YYYY-MM-DD') : ''
    ],
    prefix: 'tasks'
  });
}

/**
 * Export tasks as CSV
 */
export function exportToCSV(tasks) {
  return sharedExportCSV(tasks, {
    columns: ['Title', 'Description', 'Department', 'Dependency', 'Priority', 'Status', 'Deadline', 'Created At'],
    mapRow: (task) => [
      task.title,
      task.description || '',
      task.department || 'ETD',
      Array.isArray(task.dependency) ? task.dependency.join(', ') : (task.dependency || 'None'),
      task.priority,
      task.status,
      task.deadline ? formatDate(task.deadline, 'YYYY-MM-DD') : 'No deadline',
      task.createdAt ? formatDate(task.createdAt, 'YYYY-MM-DD') : ''
    ],
    prefix: 'tasks'
  });
}
