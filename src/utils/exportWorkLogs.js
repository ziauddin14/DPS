import { exportToPDF as sharedExportPDF, exportToExcel as sharedExportExcel, exportToCSV as sharedExportCSV, printData as sharedPrintData, formatDuration } from './exportShared.js';
import { formatDate } from './dateFormatter.js';
import { getReportTranslation } from './translations/index.js';

/**
 * Export work logs as PDF
 * @param {Array} workLogs - List of work log entries
 * @param {Object} filters - Active filters
 * @param {Object} settings - User settings
 * @param {string} [lang='en'] - Language code ('en' | 'ur')
 */
export function exportToPDF(workLogs, filters = {}, settings = {}, lang = 'en') {
  const t = getReportTranslation(lang);
  const totalMinutes = workLogs.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);

  return sharedExportPDF(workLogs, {
    title: t.workLogsReport,
    columns: [t.colDate, t.colTitle, t.colDescription, t.colCategory, t.colDuration, t.colDepartment, t.colRelatedTask, t.colRelatedFollowup],
    mapRow: (workLog) => [
      formatDate(workLog.activityDate, settings?.dateFormat || 'YYYY-MM-DD'),
      workLog.title,
      workLog.description || '-',
      workLog.category,
      formatDuration(workLog.durationMinutes),
      workLog.department || '-',
      workLog.relatedTask?.title || '-',
      workLog.relatedFollowup ? `${workLog.relatedFollowup.personName}` : '-'
    ],
    filters,
    summary: [
      `${t.totalWorkLogs}: ${workLogs.length}`,
      `${t.totalDuration}: ${formatDuration(totalMinutes)}`
    ],
    prefix: 'worklogs',
    useLandscape: true,
    totalLabel: t.totalWorkLogs,
    lang
  });
}

/**
 * Export work logs as Excel (.xlsx)
 */
export function exportToExcel(workLogs) {
  return sharedExportExcel(workLogs, {
    columns: ['Date', 'Title', 'Category', 'Description', 'Duration (minutes)', 'Department', 'Related Task', 'Related Follow-up', 'Created At'],
    mapRow: (workLog) => [
      formatDate(workLog.activityDate, 'YYYY-MM-DD'),
      workLog.title,
      workLog.category,
      workLog.description || '',
      workLog.durationMinutes || 0,
      workLog.department || '',
      workLog.relatedTask?.title || '',
      workLog.relatedFollowup ? `${workLog.relatedFollowup.personName} - ${workLog.relatedFollowup.subject}` : '',
      workLog.createdAt ? formatDate(workLog.createdAt, 'YYYY-MM-DD') : ''
    ],
    prefix: 'worklogs'
  });
}

/**
 * Export work logs as CSV
 */
export function exportToCSV(workLogs) {
  return sharedExportCSV(workLogs, {
    columns: ['Date', 'Title', 'Category', 'Description', 'Duration (minutes)', 'Department', 'Related Task', 'Related Follow-up', 'Created At'],
    mapRow: (workLog) => [
      formatDate(workLog.activityDate, 'YYYY-MM-DD'),
      workLog.title,
      workLog.category,
      workLog.description || '',
      workLog.durationMinutes || 0,
      workLog.department || '',
      workLog.relatedTask?.title || '',
      workLog.relatedFollowup ? `${workLog.relatedFollowup.personName} - ${workLog.relatedFollowup.subject}` : '',
      workLog.createdAt ? formatDate(workLog.createdAt, 'YYYY-MM-DD') : ''
    ],
    prefix: 'worklogs'
  });
}

/**
 * Print work logs
 */
export function printWorkLogs(workLogs, filters = {}) {
  const totalMinutes = workLogs.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);

  return sharedPrintData(workLogs, {
    title: 'Daily Work Log Report',
    columns: ['Date', 'Title', 'Category', 'Duration', 'Department', 'Related Task', 'Related Follow-up'],
    mapRow: (workLog) => [
      formatDate(workLog.activityDate, 'YYYY-MM-DD'),
      workLog.title,
      workLog.category,
      formatDuration(workLog.durationMinutes),
      workLog.department || '-',
      workLog.relatedTask?.title || '-',
      workLog.relatedFollowup ? workLog.relatedFollowup.personName : '-'
    ],
    filters,
    summary: [
      `Total Activities: ${workLogs.length}`,
      `Total Duration: ${formatDuration(totalMinutes)}`
    ]
  });
}
