/**
 * OAuth2 Authentication Module
 * 
 * This module handles Pinterest OAuth authentication flow.
 */
const dotenv = require('dotenv');
const { exchangeCodeForToken, getValidToken } = require('./token-manager');

// Load environment variables
dotenv.config();

// Configuration
const PINTEREST_APP_ID = process.env.PINTEREST_APP_ID;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3052/';

/**
 * Generates the Pinterest OAuth URL for authentication
 * @returns {string} OAuth authorization URL
 */
function getPinterestAuthUrl() {
  const scopes = [
    'boards:read',
    'boards:write',
    'pins:read',
    'pins:write',
    'user_accounts:read'
  ];
  
  return `https://www.pinterest.com/oauth/?client_id=${PINTEREST_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopes.join(','))}`;
}

/**
 * Handles the OAuth callback by exchanging the auth code for an access token
 * @param {string} code Authorization code from Pinterest OAuth
 * @returns {Promise<Object>} Token object
 */
async function handleOAuthCallback(code) {
  try {
    const token = await exchangeCodeForToken(code);
    return token;
  } catch (error) {
    console.error('OAuth callback error:', error.message);
    throw error;
  }
}

module.exports = {
  getPinterestAuthUrl,
  handleOAuthCallback,
  getValidToken
};
