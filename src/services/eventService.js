import API from './api';

/**
 * Event Service layer mapping to the backend event endpoints.
 */
export const eventService = {
  /**
   * Fetches all events, sorted by newest first.
   * Supports optional filters: type, date, search.
   */
  getAllEvents: async (params = {}) => {
    const response = await API.get('/events', { params });
    return response.data;
  },

  /**
   * Fetches a single event by ID.
   */
  getEventById: async (id) => {
    const response = await API.get(`/events/${id}`);
    return response.data;
  },

  /**
   * Creates a new event.
   */
  createEvent: async (eventData) => {
    const response = await API.post('/events', eventData);
    return response.data;
  },

  /**
   * Updates an existing event by ID.
   */
  updateEvent: async (id, eventData) => {
    const response = await API.put(`/events/${id}`, eventData);
    return response.data;
  },

  /**
   * Deletes an event by ID.
   */
  deleteEvent: async (id) => {
    const response = await API.delete(`/events/${id}`);
    return response.data;
  },
};

export default eventService;
