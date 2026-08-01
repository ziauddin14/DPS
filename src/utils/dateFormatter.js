/**
 * Formatting utilities for dates and times respecting the user's global settings.
 */

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Format date input according to the user's date format preference.
 *
 * Supported formats:
 *   - YYYY-MM-DD
 *   - MM/DD/YYYY
 *   - DD/MM/YYYY
 *   - DD MMM YYYY / MMM DD, YYYY
 *
 * @param {Date|string} dateInput - Date object or date-like string.
 * @param {string} [formatPattern='YYYY-MM-DD'] - User's format setting.
 * @returns {string} Formatted date.
 */
export function formatDate(dateInput, formatPattern = 'YYYY-MM-DD') {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const mmm = MONTHS_SHORT[date.getMonth()];

  const pattern = (formatPattern || 'YYYY-MM-DD').trim();

  switch (pattern) {
    case 'DD/MM/YYYY':
      return `${dd}/${mm}/${yyyy}`;
    case 'MM/DD/YYYY':
      return `${mm}/${dd}/${yyyy}`;
    case 'YYYY-MM-DD':
      return `${yyyy}-${mm}-${dd}`;
    case 'MMM DD, YYYY':
    case 'MMM D, YYYY':
      return `${mmm} ${dd}, ${yyyy}`;
    case 'DD MMM YYYY':
      return `${dd} ${mmm} ${yyyy}`;
    default:
      return `${yyyy}-${mm}-${dd}`;
  }
}

/**
 * Format time or Date input according to the user's time format preference (12-hour or 24-hour).
 *
 * @param {Date|string} timeInput - Date object or time string (e.g. "09:30" or "17:45").
 * @param {string} [timeFormat='12-hour'] - '12-hour' or '24-hour'.
 * @returns {string} Formatted time.
 */
export function formatTime(timeInput, timeFormat = '12-hour') {
  if (!timeInput) return '';

  let hours = 0;
  let minutes = 0;

  if (timeInput instanceof Date) {
    hours = timeInput.getHours();
    minutes = timeInput.getMinutes();
  } else if (typeof timeInput === 'string') {
    const trimmed = timeInput.trim();
    // Check if it is a full ISO date/datetime string or similar
    if (trimmed.includes('T') || (trimmed.length > 5 && !isNaN(Date.parse(trimmed)))) {
      const d = new Date(trimmed);
      hours = d.getHours();
      minutes = d.getMinutes();
    } else {
      // E.g. "09:00" or "17:00" or "01:30 PM"
      const match12 = trimmed.match(/^(\d+):(\d+)\s*(AM|PM)?$/i);
      if (match12) {
        hours = parseInt(match12[1], 10);
        minutes = parseInt(match12[2], 10);
        const ampm = match12[3];
        if (ampm) {
          if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
          if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
        }
      } else {
        return trimmed;
      }
    }
  } else {
    return String(timeInput);
  }

  const is12 = timeFormat === '12-hour';

  if (is12) {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    const padHours = String(displayHours).padStart(2, '0');
    const padMinutes = String(minutes).padStart(2, '0');
    return `${padHours}:${padMinutes} ${ampm}`;
  } else {
    const padHours = String(hours).padStart(2, '0');
    const padMinutes = String(minutes).padStart(2, '0');
    return `${padHours}:${padMinutes}`;
  }
}

/**
 * Format a date as a relative time string (e.g., "2 hours ago", "yesterday", "3 days ago").
 *
 * @param {Date|string} dateInput - Date object or date-like string.
 * @returns {string} Relative time string.
 */
export function formatRelativeDate(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays === 1) {
    return 'yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
}
