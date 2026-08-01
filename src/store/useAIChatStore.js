import { create } from 'zustand';

const STORAGE_KEY = 'dps-last-conversation';

/**
 * Format timestamp string from Date object or ISO string.
 */
function formatTime(dateVal) {
  if (!dateVal) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const d = new Date(dateVal);
  return isNaN(d.getTime())
    ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Zustand store for managing AI Chat session, active conversation, and conversation sidebar list.
 */
export const useAIChatStore = create((set, get) => ({
  conversationId: null,
  title: null,
  messages: [],
  conversations: [],
  isTyping: false,
  isLoadingHistory: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),

  setIsTyping: (isTyping) => set({ isTyping }),
  setIsLoadingHistory: (isLoadingHistory) => set({ isLoadingHistory }),
  setTitle: (title) => set({ title }),
  setConversations: (conversations) => set({ conversations }),

  setConversationId: (conversationId) => {
    if (conversationId) {
      try {
        localStorage.setItem(STORAGE_KEY, conversationId);
      } catch (err) {
        console.error('Failed to save dps-last-conversation to localStorage:', err);
      }
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.error('Failed to remove dps-last-conversation from localStorage:', err);
      }
    }
    set({ conversationId });
  },

  setMessages: (messages) => set({ messages, updatedAt: new Date().toISOString() }),
  setCreatedAt: (createdAt) => set({ createdAt }),
  setUpdatedAt: (updatedAt) => set({ updatedAt }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      updatedAt: new Date().toISOString(),
    })),

  updateMessage: (id, partial) =>
    set((state) => ({
      messages: state.messages.map((m) => (m.id === id ? { ...m, ...partial } : m)),
      updatedAt: new Date().toISOString(),
    })),

  // Hydrate active conversation object from MongoDB document
  hydrateConversation: (conv) => {
    if (!conv) return;

    const convId = conv.conversationId || conv._id || conv.id;
    const mappedMessages = (conv.messages || []).map((m, idx) => ({
      id: m._id || `msg-${idx}-${Date.now()}`,
      sender: m.role === 'user' ? 'user' : 'assistant',
      text: m.content || '',
      timestamp: formatTime(m.createdAt),
      createdAt: m.createdAt || new Date().toISOString(),
    }));

    if (convId) {
      try {
        localStorage.setItem(STORAGE_KEY, convId);
      } catch (err) {
        console.error('Failed to update localStorage:', err);
      }
    }

    set({
      conversationId: convId,
      title: conv.title || null,
      messages: mappedMessages,
      createdAt: conv.createdAt || new Date().toISOString(),
      updatedAt: conv.updatedAt || new Date().toISOString(),
      isLoadingHistory: false,
    });
  },

  setConversation: (conv) => get().hydrateConversation(conv),

  updateConversationTitleInStore: (id, newTitle) =>
    set((state) => ({
      conversations: state.conversations.map((c) => (c._id === id ? { ...c, title: newTitle } : c)),
      title: state.conversationId === id ? newTitle : state.title,
    })),

  removeConversationFromStore: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c._id !== id),
    })),

  createNewConversation: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear dps-last-conversation:', err);
    }

    set({
      conversationId: null,
      title: null,
      messages: [],
      isTyping: false,
      isLoadingHistory: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },

  clearConversation: () => get().createNewConversation(),
}));

export default useAIChatStore;
