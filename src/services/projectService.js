import API from './api';

/**
 * Project Service layer mapping to the backend project endpoints.
 */
export const projectService = {
  /**
   * Fetches all projects, sorted by newest first.
   * Supports optional filters: status, priority, category, search.
   */
  getAllProjects: async (params = {}) => {
    const response = await API.get('/projects', { params });
    return response.data;
  },

  /**
   * Fetches a single project by ID.
   */
  getProjectById: async (id) => {
    const response = await API.get(`/projects/${id}`);
    return response.data;
  },

  /**
   * Creates a new project.
   */
  createProject: async (projectData) => {
    const response = await API.post('/projects', projectData);
    return response.data;
  },

  /**
   * Updates an existing project by ID.
   */
  updateProject: async (id, projectData) => {
    const response = await API.put(`/projects/${id}`, projectData);
    return response.data;
  },

  /**
   * Deletes a project by ID.
   */
  deleteProject: async (id) => {
    const response = await API.delete(`/projects/${id}`);
    return response.data;
  },
};

export default projectService;
export { projectService as ProjectService };
