// API configuration for different environments
const getApiBaseUrl = () => {
  // Check if we have a custom API URL from environment
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Default based on environment
  const environment = import.meta.env.MODE || 'development';
  
  if (environment === 'production') {
    // Try to detect Railway URL automatically
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes('railway.app')) {
        return `https://${hostname}`;
      }
      if (hostname.includes('netlify.app')) {
        // For Netlify, we need to point to the Railway backend
        return 'https://brightbridge-web-production.up.railway.app';
      }
    }
    return 'https://brightbridge-web-production.up.railway.app';
  }
  
  return 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);

// API client with enhanced error handling
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
      
      // Provide user-friendly error messages
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
      }
      
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
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  }
};