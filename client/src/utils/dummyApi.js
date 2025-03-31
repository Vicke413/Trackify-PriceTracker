import { dummyData } from './api';

// Simulated delay to mimic API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Dummy API service
const dummyApi = {
  // Auth endpoints
  auth: {
    login: async (credentials) => {
      await delay(800); // Simulate network delay
      
      // Check if credentials match our dummy user (for demo purposes)
      if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
        return {
          data: {
            token: 'dummy-jwt-token-for-testing-123456789',
            user: {
              ...dummyData.user,
              email: credentials.email
            }
          }
        };
      }
      
      // Allow any credentials in demo mode
      return {
        data: {
          token: 'dummy-jwt-token-for-testing-123456789',
          user: {
            ...dummyData.user,
            email: credentials.email
          }
        }
      };
    },
    
    register: async (userData) => {
      await delay(1000);
      return {
        data: {
          message: 'User registered successfully',
          user: {
            ...userData,
            _id: 'new-user-123'
          }
        }
      };
    },
    
    profile: async () => {
      await delay(600);
      return {
        data: dummyData.user
      };
    },
    
    updateProfile: async (profileData) => {
      await delay(800);
      return {
        data: {
          ...dummyData.user,
          ...profileData
        }
      };
    },
    
    updatePassword: async () => {
      await delay(800);
      return {
        data: {
          message: 'Password updated successfully'
        }
      };
    },
  },
  
  // Products endpoints
  products: {
    search: async (params) => {
      await delay(1200);
      const query = params.query.toLowerCase();
      
      // Filter dummy products based on search query
      const filteredProducts = dummyData.products.filter(
        product => product.title.toLowerCase().includes(query)
      );
      
      return {
        data: {
          search_results: filteredProducts.map(product => ({
            asin: product.asin,
            title: product.title,
            price: {
              value: product.currentPrice,
              before_price: {
                value: product.originalPrice
              },
              savings_percent: product.discount
            },
            image: product.imageUrl,
            link: product.productUrl,
            rating: product.rating,
            ratings_total: product.reviewCount
          }))
        }
      };
    },
    
    trending: async () => {
      await delay(900);
      return {
        data: dummyData.products
      };
    },
    
    tracked: async () => {
      await delay(700);
      // Return just 2 products for testing
      return {
        data: dummyData.products.slice(0, 2)
      };
    },
    
    trackProduct: async (productId) => {
      await delay(600);
      return {
        data: {
          message: 'Product tracked successfully',
          product: dummyData.products.find(p => p._id === productId || p.asin === productId)
        }
      };
    },
    
    untrackProduct: async (productId) => {
      await delay(500);
      return {
        data: {
          message: 'Product untracked successfully'
        }
      };
    },
    
    details: async (productId) => {
      await delay(800);
      const product = dummyData.products.find(p => p._id === productId || p.asin === productId);
      
      if (!product) {
        throw {
          response: {
            status: 404,
            data: {
              message: 'Product not found'
            }
          }
        };
      }
      
      return {
        data: product
      };
    },
    
    priceHistory: async (productId) => {
      await delay(1000);
      
      // Generate random price history data
      const today = new Date();
      const priceHistory = [];
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        const product = dummyData.products.find(p => p._id === productId || p.asin === productId);
        const basePrice = product ? product.currentPrice : 100;
        
        // Random price fluctuation
        const randomFactor = 0.9 + (Math.random() * 0.3); // 0.9 to 1.2
        
        priceHistory.push({
          date: date.toISOString().split('T')[0],
          price: parseFloat((basePrice * randomFactor).toFixed(2))
        });
      }
      
      return {
        data: priceHistory
      };
    },
  }
};

export default dummyApi;