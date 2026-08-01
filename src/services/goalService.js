import API from './api';

/**
 * Goal Service layer mapping to the backend goal endpoints.
 */
export const goalService = {
  /**
   * Fetches all goals, sorted by newest first.
   * Supports optional filters: type, status, priority, category, search.
   */
  getAllGoals: async (params = {}) => {
    const response = await API.get('/goals', { params });
    return response.data;
  },

  /**
   * Fetches a single goal by ID.
   */
  getGoalById: async (id) => {
    const response = await API.get(`/goals/${id}`);
    return response.data;
  },

  /**
   * Creates a new goal.
   */
  createGoal: async (goalData) => {
    const response = await API.post('/goals', goalData);
    return response.data;
  },

  /**
   * Updates an existing goal by ID.
   */
  updateGoal: async (id, goalData) => {
    const response = await API.put(`/goals/${id}`, goalData);
    return response.data;
  },

  /**
   * Deletes a goal by ID.
   */
  deleteTask: async (id) => {
    const response = await API.delete(`/goals/${id}`);
    return response.data;
  },
  // Supporting both deleteTask (for generic structure) and deleteGoal
  deleteGoal: async (id) => {
    const response = await API.delete(`/goals/${id}`);
    return response.data;
  },
};

export default goalService;
export { goalService as GoalService };
