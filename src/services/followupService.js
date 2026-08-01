const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Follow-up service - API calls for follow-ups
 */
const followupService = {
  /**
   * Get all follow-ups with optional filters
   */
  async getAllFollowUps(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.department) queryParams.append('department', filters.department);
    if (filters.dateFilter) queryParams.append('dateFilter', filters.dateFilter);
    
    const url = `${API_URL}/followups${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch follow-ups');
    }
    
    const data = await response.json();
    return data;
  },

  /**
   * Get a single follow-up by ID
   */
  async getFollowUpById(id) {
    const response = await fetch(`${API_URL}/followups/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch follow-up');
    }
    
    const data = await response.json();
    return data;
  },

  /**
   * Create a new follow-up
   */
  async createFollowUp(followupData) {
    const response = await fetch(`${API_URL}/followups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(followupData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create follow-up');
    }
    
    const data = await response.json();
    return data;
  },

  /**
   * Update a follow-up
   */
  async updateFollowUp(id, followupData) {
    const response = await fetch(`${API_URL}/followups/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(followupData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update follow-up');
    }
    
    const data = await response.json();
    return data;
  },

  /**
   * Delete a follow-up
   */
  async deleteFollowUp(id) {
    const response = await fetch(`${API_URL}/followups/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete follow-up');
    }
    
    const data = await response.json();
    return data;
  },
};

export default followupService;
