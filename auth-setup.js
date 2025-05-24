#!/usr/bin/env node

/**
 * Authentication Setup Script
 * 
 * This script helps you authenticate with Pinterest before using the MCP server.
 * Run this once to get your OAuth token, then the MCP server can use it.
 */

const { getPinterestAuthUrl, handleOAuthCallback } = require('./src/auth/oauth');
const open = require('open');
const express = require('express');
const { createServer } = require('http');

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8085;

console.log('🔗 Pinterest MCP Server Authentication Setup');
console.log('==========================================');

// Handle OAuth callback
app.get('/', async (req, res) => {
  const { code, error } = req.query;
  
  if (error) {
    console.error('❌ Authentication failed:', error);
    res.status(400).send(`Authentication failed: ${error}`);
    process.exit(1);
  }
  
  if (code) {
    try {
      console.log('🔄 Processing authentication...');
      const token = await handleOAuthCallback(code);
      console.log('✅ Authentication successful!');
      console.log('🎉 Your Pinterest MCP server is now ready to use with Claude Desktop.');
      
      res.send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #E60023;">✅ Authentication Successful!</h1>
            <p>Your Pinterest MCP server is now authenticated.</p>
            <p>You can close this window and use Claude Desktop.</p>
          </body>
        </html>
      `);
      
      // Give some time for the response to be sent
      setTimeout(() => {
        server.close();
        process.exit(0);
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error during authentication:', error.message);
      res.status(500).send(`Authentication failed: ${error.message}`);
      process.exit(1);
    }
  } else {
    res.status(400).send('No authorization code provided');
  }
});

// Start server and open browser
server.listen(PORT, async () => {
  console.log('🚀 Authentication server started on http://localhost:' + PORT);
  console.log('🌐 Opening Pinterest authentication page...');
  
  try {
    const authUrl = getPinterestAuthUrl();
    await open(authUrl);
    console.log('👆 If the browser didn\'t open automatically, visit:');
    console.log('   ' + authUrl);
  } catch (error) {
    console.error('❌ Could not open browser. Please manually visit:');
    console.error('   ' + getPinterestAuthUrl());
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Authentication cancelled by user');
  server.close();
  process.exit(0);
});
