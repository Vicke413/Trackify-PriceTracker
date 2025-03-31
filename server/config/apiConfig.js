require('dotenv').config();

const RAINFOREST_API_KEY = process.env.RAINFOREST_API_KEY;
const RAINFOREST_API_URL = 'https://api.rainforestapi.com/request';

/**
 * Amazon product search parameters
 * @param {string} query - Search query
 * @param {string} category - Category ID (optional)
 * @param {number} page - Page number (optional)
 */
const getSearchParams = (query, category = '', page = 1) => {
  return {
    api_key: RAINFOREST_API_KEY,
    type: 'search',
    amazon_domain: 'amazon.com',
    search_term: query,
    category_id: category,
    page: page
  };
};

/**
 * Amazon product details parameters
 * @param {string} asin - Amazon ASIN
 */
const getProductParams = (asin) => {
  return {
    api_key: RAINFOREST_API_KEY,
    type: 'product',
    amazon_domain: 'amazon.com',
    asin: asin,
    include_data: 'also_bought,specifications,features,dimensions,videos'
  };
};

/**
 * Get request options for Axios
 * @param {object} params - API parameters
 * @returns {object} - Axios request config
 */
const getRequestOptions = (params) => {
  return {
    method: 'GET',
    url: RAINFOREST_API_URL,
    params: params
  };
};

module.exports = {
  getSearchParams,
  getProductParams,
  getRequestOptions
}; 