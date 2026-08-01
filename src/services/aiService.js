import API from './api';

/**
 * AI & Conversation Service layer for communicating with backend AI & Conversation endpoints.
 */
export const aiService = {
  /**
   * Sends a user chat message and optional conversation history / conversationId to the AI backend.
   *
   * @param {string} message - User chat prompt.
   * @param {Array} [conversationHistory=[]] - Conversation context array.
   * @param {string} [conversationId=null] - Active conversation ID.
   * @returns {Promise<object>} API response payload.
   */
  sendMessage: async (message, conversationHistory = [], conversationId = null) => {
    const response = await API.post('/ai/chat', {
      message,
      conversationHistory,
      conversationId,
    });
    return response.data;
  },

  /**
   * Gets all conversations sorted by updatedAt desc.
   */
  getAllConversations: async () => {
    const response = await API.get('/conversations');
    return response.data;
  },

  /**
   * Gets the most recently updated conversation from the backend.
   */
  getLatestConversation: async () => {
    const response = await API.get('/conversations/latest');
    return response.data;
  },

  /**
   * Gets a specific conversation by ID.
   *
   * @param {string} id - Conversation ObjectId.
   */
  getConversationById: async (id) => {
    const response = await API.get(`/conversations/${id}`);
    return response.data;
  },

  /**
   * Updates/renames a conversation title by ID.
   *
   * @param {string} id - Conversation ObjectId.
   * @param {string} title - New title string.
   */
  updateConversationTitle: async (id, title) => {
    const response = await API.patch(`/conversations/${id}`, { title });
    return response.data;
  },

  /**
   * Deletes a conversation by ID.
   *
   * @param {string} id - Conversation ObjectId.
   */
  deleteConversation: async (id) => {
    const response = await API.delete(`/conversations/${id}`);
    return response.data;
  },
};

export default aiService;
export { aiService as AIService };
