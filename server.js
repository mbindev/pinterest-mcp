/**
 * Pinterest MCP Server
 * 
 * This MCP server allows AI agents/LLMs to interact with the Pinterest API.
 * Based on Model Context Protocol (MCP) standard.
 */

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const open = require('open');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Import modules
const { setupSocketHandlers } = require('./src/mcp/socket-handler');
const { getPinterestAuthUrl, handleOAuthCallback, getValidToken } = require('./src/auth/oauth');
const { getUserInfo } = require('./src/api/user');

// Load environment variables
dotenv.config();

// Configuration
const PORT = process.env.PORT || 3052;
const TOKEN_PATH = path.join(__dirname, 'tokens', 'pinterest_token.json');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server and socket.io instance
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Set up socket handlers
setupSocketHandlers(io);

// Ensure tokens directory exists
if (!fs.existsSync(path.join(__dirname, 'tokens'))) {
  fs.mkdirSync(path.join(__dirname, 'tokens'), { recursive: true });
}

/**
 * Express Routes
 */

// OAuth callback route
app.get('/', async (req, res) => {
  const { code } = req.query;
  
  if (code) {
    try {
      await handleOAuthCallback(code);
      res.send('Authentication successful! You can close this window.');
    } catch (error) {
      res.status(500).send(`Authentication failed: ${error.message}`);
    }
  } else {
    res.status(400).send('No authorization code provided');
  }
});

// Route to trigger authentication flow
app.get('/auth', (req, res) => {
  const authUrl = getPinterestAuthUrl();
  res.redirect(authUrl);
});

// MCP server info endpoint
app.get('/info', (req, res) => {
  const { mcp_tools } = require('./src/mcp/tools');
  
  res.json({
    name: 'Pinterest MCP Server',
    version: '1.0.0',
    description: 'MCP server for Pinterest API integration',
    tools: mcp_tools.map(tool => tool.name)
  });
});

// Start the server
httpServer.listen(PORT, async () => {
  console.log(`Pinterest MCP Server running on http://localhost:${PORT}`);
  
  // Check if token exists, if not prompt for authentication
  if (!fs.existsSync(TOKEN_PATH)) {
    console.log('No authentication token found. Opening browser for authentication...');
    await open(`http://localhost:${PORT}/auth`);
  } else {
    console.log('Authentication token file found.');
    
    // Verify token is valid
    try {
      const token = await getValidToken();
      if (token) {
        const userInfo = await getUserInfo(token.access_token);
        console.log(`Authenticated as: ${userInfo.username}`);
      }
    } catch (error) {
      console.error('Error verifying token:', error.message);
      console.log(`Please re-authenticate by visiting http://localhost:${PORT}/auth`);
    }
  }
});
