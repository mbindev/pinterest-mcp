const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configuration
const PINTEREST_API_URL = process.env.PINTEREST_API_URL || 'https://api.pinterest.com/v5';

// List pins on a board
async function listPins(accessToken, boardId, params = {}) {
  try {
    const response = await axios.get(`${PINTEREST_API_URL}/boards/${boardId}/pins`, {
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
    console.error('Error listing pins:', error.response?.data || error.message);
    throw error;
  }
}

// Create a new pin
async function createPin(accessToken, pinData) {
  try {
    const response = await axios.post(`${PINTEREST_API_URL}/pins`, pinData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating pin:', error.response?.data || error.message);
    throw error;
  }
}

// Get pin details
async function getPinDetails(accessToken, pinId) {
  try {
    const response = await axios.get(`${PINTEREST_API_URL}/pins/${pinId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting pin details:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  listPins,
  createPin,
  getPinDetails
};
