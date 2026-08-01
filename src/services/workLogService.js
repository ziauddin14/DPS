import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const workLogService = {
  /**
   * Get all work logs with optional filters
   */
  async getWorkLogs(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.department) params.append('department', filters.department);
    if (filters.dateFilter) params.append('dateFilter', filters.dateFilter);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString();
    const url = `${API_URL}/worklogs${queryString ? `?${queryString}` : ''}`;

    const response = await axios.get(url);
    return response.data;
  },

  /**
   * Get single work log by ID
   */
  async getWorkLogById(id) {
    const response = await axios.get(`${API_URL}/worklogs/${id}`);
    return response.data;
  },

  /**
   * Create new work log
   */
  async createWorkLog(workLogData) {
    const response = await axios.post(`${API_URL}/worklogs`, workLogData);
    return response.data;
  },

  /**
   * Update work log
   */
  async updateWorkLog(id, workLogData) {
    const response = await axios.put(`${API_URL}/worklogs/${id}`, workLogData);
    return response.data;
  },

  /**
   * Delete work log
   */
  async deleteWorkLog(id) {
    const response = await axios.delete(`${API_URL}/worklogs/${id}`);
    return response.data;
  },
};

export default workLogService;
