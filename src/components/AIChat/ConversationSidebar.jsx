import { useState, useMemo } from 'react';
import { Plus, MessageSquare, X } from 'lucide-react';
import ConversationSearch from './ConversationSearch';
import ConversationGroups from './ConversationGroups';

/**
 * ConversationSidebar component — desktop side panel & mobile drawer for full conversation management.
 */
function ConversationSidebar({
  conversations = [],
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onRenameSubmit,
  onDeleteRequest,
  onCloseMobileDrawer,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Instant client-side search filtering by title or last message content
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase().trim();

    return conversations.filter((conv) => {
      const titleMatch = (conv.title || '').toLowerCase().includes(query);
      const lastMsg = conv.messages?.[conv.messages.length - 1];
      const messageMatch = (lastMsg?.content || '').toLowerCase().includes(query);
      return titleMatch || messageMatch;
    });
  }, [conversations, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-sm overflow-hidden w-full lg:w-[320px] flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              AI Conversations
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300">
              {conversations.length}
            </span>
          </div>

          {/* Close button for mobile drawer */}
          {onCloseMobileDrawer && (
            <button
              type="button"
              onClick={onCloseMobileDrawer}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* New Chat Button */}
        <button
          type="button"
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-xs font-bold shadow-xs shadow-primary-200 hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>

        {/* Search Input */}
        <ConversationSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Conversation List / Groups Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 min-h-[300px]">
        {filteredConversations.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-500 space-y-2">
            <MessageSquare className="w-8 h-8 stroke-1 opacity-50" />
            <p className="text-xs font-semibold">
              {searchQuery ? 'No matching conversations found' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          <ConversationGroups
            conversations={filteredConversations}
            activeId={activeConversationId}
            onSelectConversation={onSelectConversation}
            onRenameSubmit={onRenameSubmit}
            onDeleteRequest={onDeleteRequest}
          />
        )}
      </div>
    </div>
  );
}

export default ConversationSidebar;
export { ConversationSidebar };
