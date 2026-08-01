import API from './api';

/**
 * Settings Service — maps to the backend /api/v1/settings endpoints.
 * Also exposes a health check that reads the real /health endpoint so the
 * Settings page can show accurate Backend / Database status pills.
 */
const settingsService = {
  /**
   * Fetch the application settings document.
   * The backend auto-creates one with defaults if none exists yet.
   */
  getSettings: async () => {
    const response = await API.get('/settings');
    return response.data;
  },

  /**
   * Persist updated settings to the backend.
   * @param {Object} data - Cleaned settings payload.
   */
  updateSettings: async (data) => {
    const response = await API.put('/settings', data);
    return response.data;
  },

  /**
   * Probe the real /health endpoint.
   * Returns { backend: 'online'|'offline', database: 'connected'|'disconnected'|'unknown', uptime, timestamp }.
   * If the request itself fails the backend is unreachable.
   */
  getHealth: async () => {
    try {
      // /health lives at the Express root — strip the /api/v1 prefix.
      const base = API.defaults.baseURL?.replace(/\/api\/v1\/?$/, '') ?? '';
      const response = await API.get(`${base}/health`, { baseURL: '' });
      return {
        backend:  response.data.backend  ?? 'online',
        database: response.data.database ?? 'disconnected',
        uptime:   response.data.uptime   ?? null,
        timestamp: response.data.timestamp ?? null,
      };
    } catch {
      return { backend: 'offline', database: 'unknown', uptime: null, timestamp: null };
    }
  },
};

export default settingsService;
export { settingsService };
