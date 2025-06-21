// API configuration for different environments
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3001',
  },
  production: {
    // Replace with your actual backend URL when deployed
    baseURL: 'https://your-backend-service.railway.app',
  }
};

const environment = import.meta.env.MODE || 'development';
export const API_BASE_URL = API_CONFIG[environment].baseURL;

// API client with proper error handling
export const apiClient = {
  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
};