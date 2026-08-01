import API from './api';

/**
 * Task Service layer mapping to the backend task endpoints.
 */
export const taskService = {
  /**
   * Fetches all tasks, sorted by newest first.
   */
  getAllTasks: async (params = {}) => {
    const response = await API.get('/tasks', { params });
    return response.data;
  },

  /**
   * Creates a new task.
   */
  createTask: async (taskData) => {
    const response = await API.post('/tasks', taskData);
    return response.data;
  },

  /**
   * Updates an existing task by ID.
   */
  updateTask: async (id, taskData) => {
    const response = await API.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  /**
   * Deletes a task by ID.
   */
  deleteTask: async (id) => {
    const response = await API.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default taskService;
