import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Check, X } from 'lucide-react';
import ConversationMenu from './ConversationMenu';

/**
 * Format relative time (Today, Yesterday, X days ago, etc.)
 */
function formatRelativeTime(dateVal) {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 24 && d.getDate() === now.getDate()) return 'Today';

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth()) return 'Yesterday';

  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/**
 * Get display title (auto trim if still "New Conversation")
 */
function getDisplayTitle(conv) {
  if (conv.title && conv.title !== 'New Conversation') return conv.title;
  const firstUserMsg = (conv.messages || []).find((m) => m.role === 'user');
  if (firstUserMsg && firstUserMsg.content) {
    const raw = firstUserMsg.content.replace(/\s+/g, ' ').trim();
    return raw.length > 40 ? `${raw.slice(0, 40)}...` : raw;
  }
  return 'New Conversation';
}

/**
 * ConversationItem component — single conversation card with inline rename and active styling.
 */
const ConversationItem = React.memo(function ConversationItem({
  conversation,
  isActive = false,
  onSelect,
  onRenameSubmit,
  onDeleteRequest,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartRename = () => {
    setEditTitle(getDisplayTitle(conversation));
    setIsEditing(true);
  };

  const handleSaveRename = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== conversation.title) {
      onRenameSubmit(conversation._id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveRename();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  const lastMsg = conversation.messages?.[conversation.messages.length - 1];
  const lastMsgSnippet = lastMsg?.content
    ? lastMsg.content.replace(/\s+/g, ' ').slice(0, 50)
    : 'No messages yet';

  const relativeTime = formatRelativeTime(conversation.updatedAt || conversation.createdAt);
  const displayTitle = getDisplayTitle(conversation);

  return (
    <div
      onClick={() => !isEditing && onSelect && onSelect(conversation._id)}
      className={`group relative flex items-start gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
        isActive
          ? 'bg-primary-50/90 dark:bg-primary-950/40 border-primary-200 dark:border-primary-800 shadow-xs'
          : 'bg-white/60 dark:bg-slate-800/60 hover:bg-slate-100/70 dark:hover:bg-slate-700/50 border-slate-100 dark:border-slate-700/60'
      }`}
    >
      {/* Icon */}
      <div
        className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${
          isActive
            ? 'bg-primary-600 text-white shadow-xs'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
        }`}
      >
        <MessageSquare className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-1">
        {isEditing ? (
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-primary-500 rounded-lg px-2 py-1 outline-none"
            />
            <button
              type="button"
              onClick={handleSaveRename}
              className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-1">
              <h4
                className={`text-xs font-bold truncate leading-snug ${
                  isActive
                    ? 'text-primary-900 dark:text-primary-200'
                    : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {displayTitle}
              </h4>
              {relativeTime && (
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 flex-shrink-0">
                  {relativeTime}
                </span>
              )}
            </div>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate mt-0.5">
              {lastMsgSnippet}
            </p>
          </>
        )}
      </div>

      {/* Dropdown Menu (Visible on hover or when active) */}
      {!isEditing && (
        <div className={`flex-shrink-0 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
          <ConversationMenu
            onRename={handleStartRename}
            onDelete={() => onDeleteRequest(conversation._id)}
          />
        </div>
      )}
    </div>
  );
});

export default ConversationItem;
export { ConversationItem };
