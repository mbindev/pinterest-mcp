// Pinterest API - Boards Management
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configuration
const PINTEREST_API_URL = process.env.PINTEREST_API_URL || 'https://api.pinterest.com/v5';

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

// Create a new board
async function createBoard(accessToken, boardData) {
  try {
    const response = await axios.post(`${PINTEREST_API_URL}/boards`, boardData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating board:', error.response?.data || error.message);
    throw error;
  }
}

// Get board details
async function getBoardDetails(accessToken, boardId) {
  try {
    const response = await axios.get(`${PINTEREST_API_URL}/boards/${boardId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting board details:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  listBoards,
  createBoard,
  getBoardDetails
};