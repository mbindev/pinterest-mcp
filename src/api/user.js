/**
 * Pinterest API Functions
 */
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configuration
const PINTEREST_API_URL = process.env.PINTEREST_API_URL || 'https://api.pinterest.com/v5';

// Get user information
async function getUserInfo(accessToken) {
  try {
    const response = await axios.get(`${PINTEREST_API_URL}/user_account`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting user info:', error.response?.data || error.message);
    throw error;
  }
}

// List user's boards
async function listBoards(accessToken, params = {}) {
  try {
    const response = await axios.get(`${PINTEREST_API_URL}/boards`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        page_size: params.pageSize || 25,
        bookmark: params.bookmark || ''
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error listing boards:', error.response?.data || error.message);
    throw error;
  }
}