import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

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

export default api;
