import { formatDate } from './dateFormatter';

/**
 * Generate WhatsApp share message for a single work log
 */
export function generateSingleWorkLogMessage(workLog, settings) {
  const formatDuration = (minutes) => {
    if (!minutes) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const message = `📋 Work Log: ${workLog.title}

📅 Date: ${formatDate(workLog.activityDate, settings?.dateFormat || 'YYYY-MM-DD')}
🏷 Category: ${workLog.category}
⏱ Duration: ${formatDuration(workLog.durationMinutes)}
🏢 Department: ${workLog.department || 'Not specified'}

📝 Description:
${workLog.description || 'No description provided.'}`;

  return encodeURIComponent(message);
}

/**
 * Generate WhatsApp share message for multiple filtered work logs
 */
export function generateFilteredWorkLogsMessage(workLogs, filters = {}) {
  if (!workLogs || workLogs.length === 0) return null;

  const today = new Date();
  const formattedDate = formatDate(today, 'DD MMMM YYYY');

  const totalMinutes = workLogs.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalRemainingMinutes = totalMinutes % 60;

  const formatDuration = (minutes) => {
    if (!minutes) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  // Calculate category breakdown
  const categoryBreakdown = {};
  workLogs.forEach((w) => {
    categoryBreakdown[w.category] = (categoryBreakdown[w.category] || 0) + 1;
  });

  let message = `Digital Personal Secretary

Daily Work Log Report

Date:
${formattedDate}

Activities:
${workLogs.length}

Hours Worked:
${formatDuration(totalMinutes)}`;

  // Add category breakdown if there are categories
  if (Object.keys(categoryBreakdown).length > 0) {
    message += `

Categories
`;
    Object.entries(categoryBreakdown).forEach(([category, count]) => {
      message += `${category} : ${count}
`;
    });
  }

  // Add filters if any
  let filterText = '';
  if (filters.search) filterText += `Search: ${filters.search} | `;
  if (filters.category && filters.category !== 'All') filterText += `Category: ${filters.category} | `;
  if (filters.department && filters.department !== 'All') filterText += `Department: ${filters.department} | `;
  if (filters.dateFilter && filters.dateFilter !== 'All') filterText += `Date: ${filters.dateFilter} | `;
  if (filters.startDate) filterText += `From: ${filters.startDate} | `;
  if (filters.endDate) filterText += `To: ${filters.endDate} | `;
  
  if (filterText) {
    filterText = filterText.slice(0, -3);
    message += `

Applied Filters:
${filterText}`;
  }

  message += `

Generated from Digital Personal Secretary`;

  return encodeURIComponent(message);
}

/**
 * Open WhatsApp with a message
 */
export function openWhatsApp(message) {
  const url = `https://wa.me/?text=${message}`;
  window.open(url, '_blank');
}
