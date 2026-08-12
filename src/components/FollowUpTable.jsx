import { Edit2, Trash2, Phone, MessageCircle, ChevronDown, ChevronUp, Plus, Check, Share2, Printer } from 'lucide-react';
import { Badge, Button } from './ui';
import { formatDate, formatTime } from '../utils/dateFormatter';
import { useState } from 'react';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';

/**
 * FollowUpTable component - Professional table rendering for follow-ups
 */
function FollowUpTable({ followups, onEdit, onDelete, onAddNote, onShare, onPrint, selectedRows, onToggleRow, onSelectAll }) {
  const tableRef = useHorizontalScroll();

  // Priority badge variants
  const priorityVariants = {
    High: 'danger',
    Medium: 'warning',
    Low: 'success',
  };

  // Status badge variants
  const statusVariants = {
    Pending: 'warning',
    Contacted: 'info',
    'Waiting Reply': 'warning-orange',
    Completed: 'success',
    Cancelled: 'neutral',
  };

  // Get next follow-up date color class
  const getNextFollowupColor = (date) => {
    if (!date) return 'text-slate-400';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const followupDate = new Date(date);
    followupDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.ceil((followupDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-rose-600 font-semibold'; // Overdue
    if (diffDays === 0) return 'text-amber-600 font-semibold'; // Today
    if (diffDays === 1) return 'text-emerald-600 font-semibold'; // Tomorrow
    return 'text-slate-600'; // Future
  };

  // Check if follow-up is overdue
  const isOverdue = (date, status) => {
    if (!date || status === 'Completed') return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const followupDate = new Date(date);
    followupDate.setHours(0, 0, 0, 0);
    
    return followupDate < today;
  };

  // Check if follow-up is today
  const isToday = (date) => {
    if (!date) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const followupDate = new Date(date);
    followupDate.setHours(0, 0, 0, 0);
    
    return followupDate.getTime() === today.getTime();
  };

  // Clean phone number for WhatsApp (remove spaces, +, -, ())
  const cleanPhoneNumber = (phone) => {
    if (!phone) return '';
    return phone.replace(/[\s\+\-\(\)]/g, '');
  };

  // State for expanded notes
  const [expandedNotes, setExpandedNotes] = useState({});

  // Toggle notes expansion
  const toggleNotes = (id) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (followups.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Desktop/Tablet Table View */}
      <div className="hidden md:block overflow-x-auto" ref={tableRef} tabIndex={0}>
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selectedRows.size === followups.length && followups.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  aria-label="Select all follow-ups"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Person
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Next Follow-up
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {followups.map((followup) => {
              const isOverdueItem = isOverdue(followup.nextFollowupDate, followup.status);
              const isTodayItem = isToday(followup.nextFollowupDate);
              
              return (
                <tr
                  key={followup._id}
                  className={`hover:bg-slate-50 transition-colors ${
                    isOverdueItem ? 'bg-rose-50/30' : ''
                  } ${isTodayItem && !isOverdueItem ? 'bg-amber-50/30' : ''} ${
                    followup.status === 'Completed' ? 'opacity-60' : ''
                  }`}
                >
                {/* Checkbox */}
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(followup._id)}
                    onChange={() => onToggleRow(followup._id)}
                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    aria-label={`Select ${followup.personName}`}
                  />
                </td>

                {/* Person Name */}
                <td className="px-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{followup.personName}</div>
                    {followup.phoneNumber && (
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={`tel:${followup.phoneNumber}`}
                          className="text-xs text-slate-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
                          aria-label={`Call ${followup.personName}`}
                        >
                          <Phone className="w-3 h-3" />
                          {followup.phoneNumber}
                        </a>
                        <a
                          href={`https://wa.me/${cleanPhoneNumber(followup.phoneNumber)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                          aria-label={`WhatsApp ${followup.personName}`}
                        >
                          <MessageCircle className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </td>

                {/* Company */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600">{followup.company || '-'}</span>
                </td>

                {/* Subject */}
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-slate-900 max-w-xs truncate">
                    {followup.subject}
                  </div>
                  {followup.description && (
                    <div className="text-xs text-slate-500 max-w-xs truncate mt-1">
                      {followup.description}
                    </div>
                  )}
                </td>

                {/* Priority */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <Badge
                    variant={priorityVariants[followup.priority] || 'neutral'}
                    className="text-[10px] uppercase tracking-wider"
                  >
                    {followup.priority}
                  </Badge>
                </td>

                {/* Status */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <Badge
                    variant={statusVariants[followup.status] || 'neutral'}
                    className="text-[10px] uppercase tracking-wider"
                  >
                    {followup.status}
                  </Badge>
                </td>

                {/* Next Follow-up Date */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {isOverdue(followup.nextFollowupDate, followup.status) && (
                      <Badge variant="danger" className="text-[10px] uppercase tracking-wider">
                        OVERDUE
                      </Badge>
                    )}
                    {isToday(followup.nextFollowupDate) && !isOverdue(followup.nextFollowupDate, followup.status) && (
                      <Badge variant="primary" className="text-[10px] uppercase tracking-wider">
                        TODAY
                      </Badge>
                    )}
                    <span className={`text-xs ${getNextFollowupColor(followup.nextFollowupDate)}`}>
                      {followup.nextFollowupDate
                        ? formatDate(followup.nextFollowupDate, 'YYYY-MM-DD')
                        : 'No date'}
                    </span>
                  </div>
                </td>

                {/* Department */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-xs text-slate-600">{followup.department || '-'}</span>
                </td>

                {/* Notes */}
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleNotes(followup._id)}
                        className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                        aria-label="Toggle notes history"
                      >
                        {expandedNotes[followup._id] ? (
                          <>
                            <ChevronUp className="w-3 h-3" />
                            Hide
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3" />
                            History
                          </>
                        )}
                        <span className="text-slate-400">({followup.notes?.length || 0})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onAddNote(followup)}
                        className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                        aria-label={`Add note for ${followup.personName}`}
                      >
                        <Plus className="w-3 h-3" />
                        Add Note
                      </button>
                    </div>
                    {expandedNotes[followup._id] && (
                      <div className="mt-2 space-y-2">
                        {followup.notes && followup.notes.length > 0 ? (
                          followup.notes.slice().reverse().map((note, index) => (
                            <div
                              key={index}
                              className="bg-slate-50 dark:bg-slate-900/30 rounded-lg p-2 text-xs"
                            >
                              <div className="text-slate-500 mb-1">
                                {formatDate(note.createdAt, 'YYYY-MM-DD')} at {formatTime(note.createdAt)}
                              </div>
                              <div className="text-slate-700 dark:text-slate-300">{note.message}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-400 italic">No notes yet.</div>
                        )}
                      </div>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onShare(followup)}
                      className="p-2 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-lg"
                      aria-label={`Share ${followup.personName}`}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPrint(followup)}
                      className="p-2 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg"
                      aria-label={`Print ${followup.personName}`}
                    >
                      <Printer className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(followup)}
                      className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg"
                      aria-label={`Edit ${followup.personName}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(followup)}
                      className="p-2 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg"
                      aria-label={`Delete ${followup.personName}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 p-4">
        {followups.map((followup) => (
          <div key={followup._id} className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-4 space-y-3">
            {/* Header: Checkbox + Person + Actions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedRows.has(followup._id)}
                onChange={() => onToggleRow(followup._id)}
                className="w-4 h-4 mt-1 rounded border-slate-300 text-primary-600 focus:ring-primary-500 flex-shrink-0"
                aria-label={`Select ${followup.personName}`}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{followup.personName}</div>
                {followup.phoneNumber && (
                  <div className="flex items-center gap-3 mt-1">
                    <a
                      href={`tel:${followup.phoneNumber}`}
                      className="text-xs text-slate-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
                      aria-label={`Call ${followup.personName}`}
                    >
                      <Phone className="w-3 h-3" />
                      {followup.phoneNumber}
                    </a>
                    <a
                      href={`https://wa.me/${cleanPhoneNumber(followup.phoneNumber)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                      aria-label={`WhatsApp ${followup.personName}`}
                    >
                      <MessageCircle className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onShare(followup)}
                  className="p-2 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-lg"
                  aria-label={`Share ${followup.personName}`}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPrint(followup)}
                  className="p-2 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg"
                  aria-label={`Print ${followup.personName}`}
                >
                  <Printer className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(followup)}
                  className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg"
                  aria-label={`Edit ${followup.personName}`}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(followup)}
                  className="p-2 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg"
                  aria-label={`Delete ${followup.personName}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Company */}
            {followup.company && (
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold">Company:</span> {followup.company}
              </div>
            )}

            {/* Subject + Description */}
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{followup.subject}</div>
              {followup.description && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{followup.description}</div>
              )}
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={priorityVariants[followup.priority] || 'neutral'}
                className="text-[10px] uppercase tracking-wider"
              >
                {followup.priority}
              </Badge>
              <Badge
                variant={statusVariants[followup.status] || 'neutral'}
                className="text-[10px] uppercase tracking-wider"
              >
                {followup.status}
              </Badge>
              {isOverdue(followup.nextFollowupDate, followup.status) && (
                <Badge variant="danger" className="text-[10px] uppercase tracking-wider">
                  OVERDUE
                </Badge>
              )}
              {isToday(followup.nextFollowupDate) && !isOverdue(followup.nextFollowupDate, followup.status) && (
                <Badge variant="primary" className="text-[10px] uppercase tracking-wider">
                  TODAY
                </Badge>
              )}
              {followup.department && (
                <Badge variant="neutral" className="text-[10px] uppercase tracking-wider">
                  {followup.department}
                </Badge>
              )}
            </div>

            {/* Next Follow-up Date */}
            <div className="text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Next Follow-up:</span>{' '}
              <span className={getNextFollowupColor(followup.nextFollowupDate)}>
                {followup.nextFollowupDate
                  ? formatDate(followup.nextFollowupDate, 'YYYY-MM-DD')
                  : 'No date'}
              </span>
            </div>

            {/* Notes Section */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => toggleNotes(followup._id)}
                  className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                  aria-label="Toggle notes history"
                >
                  {expandedNotes[followup._id] ? (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      Hide
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      History
                    </>
                  )}
                  <span className="text-slate-400">({followup.notes?.length || 0})</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAddNote(followup)}
                  className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                  aria-label={`Add note for ${followup.personName}`}
                >
                  <Plus className="w-3 h-3" />
                  Add Note
                </button>
              </div>
              {expandedNotes[followup._id] && (
                <div className="space-y-2">
                  {followup.notes && followup.notes.length > 0 ? (
                    followup.notes.slice().reverse().map((note, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-slate-800 rounded-lg p-2 text-xs"
                      >
                        <div className="text-slate-500 mb-1">
                          {formatDate(note.createdAt, 'YYYY-MM-DD')} at {formatTime(note.createdAt)}
                        </div>
                        <div className="text-slate-700 dark:text-slate-300">{note.message}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic">No notes yet.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FollowUpTable;
export { FollowUpTable };
