import api, { endpoints, useDummyData } from '../utils/api';
import dummyApi from '../utils/dummyApi';

// Helper to determine whether to use the real API or dummy API
const getService = () => {
  // Use environment variable to control dummy mode
  // By default, use real API calls in both development and production
  const shouldUseDummyApi = useDummyData || localStorage.getItem('use_dummy_api') === 'true';
  
  return shouldUseDummyApi ? dummyApi : {
    auth: {
      login: (credentials) => api.post(endpoints.auth.login, credentials),
      register: (userData) => api.post(endpoints.auth.register, userData),
      profile: () => api.get(endpoints.auth.profile),
      updateProfile: (profileData) => api.put(endpoints.auth.updateProfile, profileData),
      updatePassword: (passwordData) => api.put(endpoints.auth.updatePassword, passwordData),
    },
    products: {
      search: (params) => api.get(endpoints.products.search, { params }),
      trending: () => api.get(endpoints.products.trending),
      tracked: () => api.get(endpoints.products.tracked),
      trackProduct: (productId) => api.post(endpoints.products.trackProduct(productId)),
      untrackProduct: (productId) => api.delete(endpoints.products.untrackProduct(productId)),
      details: (productId) => api.get(endpoints.products.details(productId)),
      priceHistory: (productId) => api.get(endpoints.products.priceHistory(productId)),
    }
  };
};

// Export the service
const apiService = getService();
export default apiService;

// Create a toggle function for switching between real and dummy API
// This can be useful during development
export const toggleDummyApi = (enabled) => {
  localStorage.setItem('use_dummy_api', enabled ? 'true' : 'false');
  window.location.reload();
};

// Export a helper to check if using dummy API
export const isDummyApiEnabled = () => {
  return useDummyData || localStorage.getItem('use_dummy_api') === 'true';
};