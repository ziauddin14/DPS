import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { PageHeader } from '../components/ui';
import AIChatWindow from '../components/AIChat/AIChatWindow';
import ConversationSidebar from '../components/AIChat/ConversationSidebar';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import aiService from '../services/aiService';
import useAIChatStore from '../store/useAIChatStore';

/**
 * Helper to generate a concise 3-5 word conversation title from the first user prompt.
 */
function generateConversationTitle(text) {
  if (!text) return 'New Conversation';

  const cleaned = text
    .replace(/[^\w\s]/gi, '')
    .replace(/\b(can|you|please|i|want|to|the|a|an|me|my|for|on|in|at|with|regarding|about|should|do)\b/gi, '')
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'Work Chat';

  const titleWords = words.slice(0, 4).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  return titleWords.join(' ');
}

/**
 * AISecretary Page component — Full ChatGPT-Style Two-Column Layout with Sidebar, Switch, Rename & Delete.
 */
function AISecretary() {
  const {
    messages,
    conversations,
    isTyping,
    isLoadingHistory,
    title,
    conversationId,
    addMessage,
    updateMessage,
    setIsTyping,
    setIsLoadingHistory,
    setTitle,
    setConversations,
    setConversationId,
    updateConversationTitleInStore,
    removeConversationFromStore,
    hydrateConversation,
    createNewConversation,
  } = useAIChatStore();

  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const streamingTimeoutRef = useRef(null);

  // Fetch all conversations list from backend
  const fetchConversationsList = useCallback(async () => {
    try {
      const response = await aiService.getAllConversations();
      if (response.success && Array.isArray(response.data)) {
        setConversations(response.data);
      }
    } catch (err) {
      console.error('Failed to load conversations list:', err);
    }
  }, [setConversations]);

  // Fast Restore Effect on Page Load / Refresh
  useEffect(() => {
    let isMounted = true;

    const restoreConversation = async () => {
      setIsLoadingHistory(true);
      await fetchConversationsList();

      const savedId = localStorage.getItem('dps-last-conversation');

      // 1. Check localStorage first
      if (savedId) {
        try {
          const response = await aiService.getConversationById(savedId);
          if (isMounted && response.success && response.data) {
            hydrateConversation(response.data);
            return;
          }
        } catch (err) {
          console.warn('Saved conversationId is invalid or expired:', err);
          try {
            localStorage.removeItem('dps-last-conversation');
          } catch (e) {}
        }
      }

      // 2. Fallback to Latest Conversation
      try {
        const response = await aiService.getLatestConversation();
        if (isMounted && response.success && response.data) {
          hydrateConversation(response.data);
          return;
        }
      } catch (err) {
        console.warn('Failed to load latest conversation:', err);
      }

      // 3. No conversation found -> Show Welcome Screen
      if (isMounted) {
        setIsLoadingHistory(false);
      }
    };

    restoreConversation();

    return () => {
      isMounted = false;
    };
  }, [fetchConversationsList, hydrateConversation, setIsLoadingHistory]);

  // Smooth Character / Token Adaptive Streaming Engine
  const streamResponseText = (messageId, fullText, onComplete) => {
    let currentIndex = 0;
    let currentText = '';
    const totalLength = fullText.length;

    const chunkSize = totalLength > 400 ? 4 : totalLength > 200 ? 3 : 2;

    const step = () => {
      if (currentIndex < totalLength) {
        const nextChunk = fullText.slice(currentIndex, currentIndex + chunkSize);
        currentText += nextChunk;
        currentIndex += chunkSize;

        updateMessage(messageId, { text: currentText, isStreaming: true });

        const lastChar = nextChunk[nextChunk.length - 1];
        let delay = 16;

        if (['.', '!', '?', '\n'].includes(lastChar)) {
          delay = 45;
        } else if (lastChar === ',') {
          delay = 28;
        } else if (lastChar === ' ') {
          delay = 8;
        }

        streamingTimeoutRef.current = setTimeout(step, delay);
      } else {
        streamingTimeoutRef.current = null;
        updateMessage(messageId, { isStreaming: false });
        if (onComplete) onComplete();
      }
    };

    step();
  };

  const generateAIResponse = async (text, skipUserAppend = false) => {
    if (!text || isTyping) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Generate Conversation Title on First User Message if missing
    if (!title && !skipUserAppend) {
      const generatedTitle = generateConversationTitle(text);
      setTitle(generatedTitle);
    }

    // Append User Message if not regenerating
    if (!skipUserAppend) {
      addMessage({
        id: `user-${Date.now()}`,
        sender: 'user',
        text,
        timestamp: timeStr,
        createdAt: new Date().toISOString(),
      });
    }

    setIsTyping(true);

    try {
      // Always call backend AI endpoint for all messages
      const response = await aiService.sendMessage(text, messages, conversationId);

      // Store returned conversationId
      if (response.data?.conversationId) {
        setConversationId(response.data.conversationId);
      }

      const aiReplyText =
        response.data?.reply ||
        response.data?.message ||
        response.message ||
        'I am your **DPS AI Secretary**. I am here to help you organize work, tasks, projects, and schedules.';

      const assistantId = `ai-msg-${Date.now()}`;

      addMessage({
        id: assistantId,
        sender: 'assistant',
        text: '',
        isStreaming: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString(),
      });

      streamResponseText(assistantId, aiReplyText, () => {
        fetchConversationsList();
      });
    } catch (err) {
      console.error('AI Secretary Error:', err);
      addMessage({
        id: `ai-error-${Date.now()}`,
        sender: 'assistant',
        text: '⚠️ Something went wrong. Please try again.',
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (text) => {
    generateAIResponse(text, false);
  };

  const handleNewChat = () => {
    if (streamingTimeoutRef.current) {
      clearTimeout(streamingTimeoutRef.current);
      streamingTimeoutRef.current = null;
    }
    createNewConversation();
    setIsMobileSidebarOpen(false);
    showToast('Started new conversation', 'info');
  };

  const handleSelectConversation = async (id) => {
    if (id === conversationId) {
      setIsMobileSidebarOpen(false);
      return;
    }

    try {
      setIsLoadingHistory(true);
      setIsMobileSidebarOpen(false);
      const response = await aiService.getConversationById(id);
      if (response.success && response.data) {
        hydrateConversation(response.data);
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
      showToast('Failed to load conversation', 'error');
      setIsLoadingHistory(false);
    }
  };

  const handleRenameSubmit = async (id, newTitle) => {
    try {
      const response = await aiService.updateConversationTitle(id, newTitle);
      if (response.success) {
        updateConversationTitleInStore(id, newTitle);
        showToast('Conversation renamed', 'success');
      }
    } catch (err) {
      console.error('Failed to rename conversation:', err);
      showToast('Failed to rename conversation', 'error');
    }
  };

  const handleDeleteRequest = (id) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    const targetId = deleteTargetId;
    setDeleteTargetId(null);

    try {
      const response = await aiService.deleteConversation(targetId);
      if (response.success) {
        removeConversationFromStore(targetId);
        showToast('Conversation deleted', 'success');

        // If active conversation was deleted, switch to next newest or clear
        if (conversationId === targetId) {
          const updatedList = conversations.filter((c) => c._id !== targetId);
          if (updatedList.length > 0) {
            handleSelectConversation(updatedList[0]._id);
          } else {
            createNewConversation();
          }
        }
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      showToast('Failed to delete conversation', 'error');
    }
  };

  const handleStop = () => {
    if (streamingTimeoutRef.current) {
      clearTimeout(streamingTimeoutRef.current);
      streamingTimeoutRef.current = null;
    }

    setIsTyping(false);

    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.isStreaming) {
      updateMessage(lastMsg.id, { isStreaming: false });
    }

    showToast('Generation stopped', 'info');
  };

  const handleRegenerate = (msgId) => {
    if (isTyping) return;

    const msgIndex = messages.findIndex((m) => m.id === msgId);
    if (msgIndex === -1) return;

    let precedingUserMsg = null;
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        precedingUserMsg = messages[i];
        break;
      }
    }

    if (!precedingUserMsg) return;

    const newMessages = messages.filter((m, idx) => {
      if (m.id === msgId) return false;
      return true;
    });

    useAIChatStore.setState({ messages: newMessages });
    showToast('Regenerating response...', 'info');

    generateAIResponse(precedingUserMsg.text, true);
  };

  const handleConfirmClear = () => {
    if (streamingTimeoutRef.current) {
      clearTimeout(streamingTimeoutRef.current);
      streamingTimeoutRef.current = null;
    }
    createNewConversation();
    setIsConfirmClearOpen(false);
    showToast('Conversation cleared', 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onClose={removeToast} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        {/* <PageHeader
          title="AI Secretary"
          subtitle="Your intelligent work assistant"
          actionIcon={Bot}
        /> */}

        {/* Mobile Toggle Button for Conversation Sidebar Drawer */}
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
          className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs"
        >
          {isMobileSidebarOpen ? (
            <PanelLeftClose className="w-4 h-4 text-primary-600" />
          ) : (
            <PanelLeftOpen className="w-4 h-4 text-primary-600" />
          )}
          <span>Conversations</span>
        </button>
      </div>

      {/* Main Two-Column Layout: Conversation Sidebar + AI Chat Window */}
      <div className="flex gap-6 items-start h-[calc(100vh-230px)] min-h-[560px] relative">
        {/* Desktop Sidebar (Permanent 320px) */}
        <div className="hidden lg:block h-full">
          <ConversationSidebar
            conversations={conversations}
            activeConversationId={conversationId}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
            onRenameSubmit={handleRenameSubmit}
            onDeleteRequest={handleDeleteRequest}
          />
        </div>

        {/* Mobile Slide Drawer */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex">
            <div className="w-[300px] h-full bg-white dark:bg-slate-800 shadow-2xl animate-slideIn">
              <ConversationSidebar
                conversations={conversations}
                activeConversationId={conversationId}
                onNewChat={handleNewChat}
                onSelectConversation={handleSelectConversation}
                onRenameSubmit={handleRenameSubmit}
                onDeleteRequest={handleDeleteRequest}
                onCloseMobileDrawer={() => setIsMobileSidebarOpen(false)}
              />
            </div>
            <div className="flex-1 h-full" onClick={() => setIsMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Main AI Chat Window */}
        <div className="flex-1 h-full min-w-0">
          <AIChatWindow
            messages={messages}
            isTyping={isTyping}
            isLoadingHistory={isLoadingHistory}
            title={title}
            onSendMessage={handleSendMessage}
            onStop={handleStop}
            onRegenerate={handleRegenerate}
            onClearChat={() => setIsConfirmClearOpen(true)}
            onCopySuccess={(msg) => showToast(msg, 'success')}
          />
        </div>
      </div>

      {/* Clear Chat Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmClearOpen}
        title="Clear Conversation"
        message="Are you sure you want to clear this conversation? This will return you to the welcome screen."
        onConfirm={handleConfirmClear}
        onCancel={() => setIsConfirmClearOpen(false)}
      />

      {/* Delete Conversation Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Conversation?"
        message="Are you sure you want to delete this conversation? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}

export default AISecretary;
export { AISecretary };
