import API from './api';

/**
 * Knowledge Service — maps to the backend /api/v1/knowledge endpoints.
 */
const knowledgeService = {
  /**
   * Fetch all knowledge entries.
   * Supports optional filters: search, type, category, favorite.
   */
  getAllKnowledge: async (params = {}) => {
    const response = await API.get('/knowledge', { params });
    return response.data;
  },

  /**
   * Fetch a single knowledge entry by ID.
   */
  getKnowledgeById: async (id) => {
    const response = await API.get(`/knowledge/${id}`);
    return response.data;
  },

  /**
   * Create a new knowledge entry.
   */
  createKnowledge: async (data) => {
    const response = await API.post('/knowledge', data);
    return response.data;
  },

  /**
   * Update an existing knowledge entry by ID.
   */
  updateKnowledge: async (id, data) => {
    const response = await API.put(`/knowledge/${id}`, data);
    return response.data;
  },

  /**
   * Delete a knowledge entry by ID.
   */
  deleteKnowledge: async (id) => {
    const response = await API.delete(`/knowledge/${id}`);
    return response.data;
  },
};

export default knowledgeService;
export { knowledgeService };
