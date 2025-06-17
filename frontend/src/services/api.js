import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Flight search API functions
export const flightAPI = {
  // Search locations (both cities and airports) for autocomplete
  searchLocations: async (searchTerm) => {
    const response = await api.get('/flights/search-locations/', {
      params: { search: searchTerm }
    });
    return response.data;
  },

  // Search cities for autocomplete
  searchCities: async (searchTerm) => {
    const response = await api.get('/flights/search-cities/', {
      params: { search: searchTerm }
    });
    return response.data;
  },

  // Search airports for autocomplete
  searchAirports: async (searchTerm) => {
    const response = await api.get('/flights/search-airports/', {
      params: { search: searchTerm }
    });
    return response.data;
  },

  // Search flights with filters
  searchFlights: async (searchParams) => {
    const response = await api.get('/flights/search-flights/', {
      params: searchParams
    });
    return response.data;
  },

  // Get random flights for discovery
  getRandomFlights: async (pageSize = 10) => {
    const response = await api.get('/flights/random-flights/', {
      params: { page_size: pageSize }
    });
    return response.data;
  },
};

// Ticket API functions
export const ticketAPI = {
  // Get all tickets for the authenticated user
  getUserTickets: async () => {
    const response = await api.get('/tickets/');
    return response.data;
  },

  // Create a new ticket
  createTicket: async (ticketData) => {
    const response = await api.post('/tickets/', ticketData);
    return response.data;
  },

  // Update a ticket
  updateTicket: async (ticketId, ticketData) => {
    const response = await api.put(`/tickets/${ticketId}/`, ticketData);
    return response.data;
  },

  // Delete a ticket
  deleteTicket: async (ticketId) => {
    const response = await api.delete(`/tickets/${ticketId}/`);
    return response.data;
  },

  // Pay for a ticket
  payTicket: async (ticketId, paymentData) => {
    const response = await api.post(`/tickets/${ticketId}/pay/`, paymentData);
    return response.data;
  },

  // Get a specific ticket
  getTicket: async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}/`);
    return response.data;
  },
};

export default api;
