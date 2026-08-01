import API from './api';

/**
 * Dashboard Service layer mapping to the backend dashboard aggregation endpoint.
 */
export const dashboardService = {
  /**
   * Fetches aggregated stats and recent data for the Dashboard page.
   */
  getDashboardStats: async () => {
    const response = await API.get('/dashboard');
    return response.data;
  },
};

export default dashboardService;
export { dashboardService as DashboardService };
