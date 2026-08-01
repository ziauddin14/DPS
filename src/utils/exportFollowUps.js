import { exportToPDF as sharedExportPDF, exportToExcel as sharedExportExcel, exportToCSV as sharedExportCSV } from './exportShared.js';
import { formatDate } from './dateFormatter.js';
import { getReportTranslation } from './translations/index.js';

/**
 * Calculate summary statistics for follow-ups
 */
function calculateSummary(followups) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    total: followups.length,
    pending: followups.filter(f => f.status === 'Pending').length,
    waitingReply: followups.filter(f => f.status === 'Waiting Reply').length,
    completed: followups.filter(f => f.status === 'Completed').length,
    overdue: followups.filter(f => {
      if (!f.nextFollowupDate || f.status === 'Completed') return false;
      const followupDate = new Date(f.nextFollowupDate);
      followupDate.setHours(0, 0, 0, 0);
      return followupDate < today;
    }).length,
  };
}

/**
 * Export follow-ups as PDF
 * @param {Array} followups - List of follow-ups
 * @param {Object} settings - User settings
 * @param {Object} filters - Active filters
 * @param {string} [lang='en'] - Language code ('en' | 'ur')
 */
export function exportToPDF(followups, settings, filters = {}, lang = 'en') {
  const t = getReportTranslation(lang);

  const translatePriority = (priority) => {
    if (priority === 'High') return t.priorityHigh;
    if (priority === 'Medium') return t.priorityMedium;
    if (priority === 'Low') return t.priorityLow;
    return priority || '-';
  };

  const translateStatus = (status) => {
    if (status === 'Pending') return t.statusPending;
    if (status === 'Waiting Reply') return t.statusWaitingReply;
    if (status === 'Completed') return t.statusCompleted;
    if (status === 'In Progress') return t.statusInProgress;
    return status || '-';
  };

  const summary = calculateSummary(followups);
  const summaryText = [
    `${t.summaryTotal}: ${summary.total}`,
    `${t.summaryPending}: ${summary.pending}`,
    `${t.summaryWaitingReply}: ${summary.waitingReply}`,
    `${t.summaryCompleted}: ${summary.completed}`,
    `${t.summaryOverdue}: ${summary.overdue}`
  ];

  return sharedExportPDF(followups, {
    title: t.followupsReport,
    columns: [t.colPerson, t.colSubject, t.colDescription, t.colPriority, t.colStatus, t.colDepartment, t.colNextFollowup],
    mapRow: (followup) => [
      followup.personName,
      followup.subject,
      followup.description || '-',
      translatePriority(followup.priority),
      translateStatus(followup.status),
      followup.department || '-',
      followup.nextFollowupDate ? formatDate(followup.nextFollowupDate, settings?.dateFormat || 'YYYY-MM-DD') : t.noDate
    ],
    filters,
    summary: summaryText,
    prefix: 'follow-ups',
    useLandscape: true,
    totalLabel: t.totalFollowups,
    lang
  });
}

/**
 * Export follow-ups as Excel (.xlsx)
 */
export function exportToExcel(followups) {
  return sharedExportExcel(followups, {
    columns: ['Person', 'Company', 'Phone', 'Subject', 'Description', 'Priority', 'Status', 'Department', 'Next Follow-up', 'Last Contact', 'Related Task', 'Related Project', 'Notes Count'],
    mapRow: (followup) => [
      followup.personName,
      followup.company || '',
      followup.phoneNumber || '',
      followup.subject,
      followup.description || '',
      followup.priority,
      followup.status,
      followup.department || '',
      followup.nextFollowupDate ? formatDate(followup.nextFollowupDate, 'YYYY-MM-DD') : '',
      followup.lastContactDate ? formatDate(followup.lastContactDate, 'YYYY-MM-DD') : '',
      followup.relatedTask?.title || '',
      followup.relatedProject?.title || '',
      Array.isArray(followup.notes) ? followup.notes.length : 0
    ],
    prefix: 'follow-ups'
  });
}

/**
 * Export follow-ups as CSV
 */
export function exportToCSV(followups) {
  return sharedExportCSV(followups, {
    columns: ['Person', 'Company', 'Phone', 'Subject', 'Description', 'Priority', 'Status', 'Department', 'Next Follow-up', 'Last Contact', 'Related Task', 'Related Project', 'Notes Count'],
    mapRow: (followup) => [
      followup.personName,
      followup.company || '',
      followup.phoneNumber || '',
      followup.subject,
      followup.description || '',
      followup.priority,
      followup.status,
      followup.department || '',
      followup.nextFollowupDate ? formatDate(followup.nextFollowupDate, 'YYYY-MM-DD') : '',
      followup.lastContactDate ? formatDate(followup.lastContactDate, 'YYYY-MM-DD') : '',
      followup.relatedTask?.title || '',
      followup.relatedProject?.title || '',
      Array.isArray(followup.notes) ? followup.notes.length : 0
    ],
    prefix: 'follow-ups'
  });
}
