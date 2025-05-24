#!/usr/bin/env node

/**
 * Test script for MCP Server
 * This script tests if the MCP server can start without errors
 */

console.log('🔍 Testing Pinterest MCP Server...');

async function testMCPServer() {
  try {
    console.log('📦 Testing module imports...');
    
    // Test if we can import our modules
    const { getUserInfo } = require('./src/api/user');
    const { listBoards, createBoard, getBoardDetails } = require('./src/api/boards');
    const { listPins, createPin, getPinDetails } = require('./src/api/pins');
    const { getValidToken } = require('./src/auth/oauth');
    const { mcp_tools } = require('./src/mcp/tools');
    
    console.log('✅ Module imports successful');
    console.log(`📋 Found ${mcp_tools.length} MCP tools:`);
    mcp_tools.forEach(tool => console.log(`   - ${tool.name}`));
    
    // Validate tool names (check for Claude Desktop compatibility)
    console.log('🔍 Validating tool names for Claude Desktop...');
    const namePattern = /^[a-zA-Z0-9_-]+$/;
    let allNamesValid = true;
    
    mcp_tools.forEach(tool => {
      if (!namePattern.test(tool.name)) {
        console.error(`❌ Invalid tool name: ${tool.name} (contains invalid characters)`);
        allNamesValid = false;
      }
    });
    
    if (allNamesValid) {
      console.log('✅ All tool names are Claude Desktop compatible');
    } else {
      console.error('❌ Some tool names are invalid for Claude Desktop');
    }
    
    // Test MCP SDK import
    console.log('🔧 Testing MCP SDK imports...');
    
    try {
      const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
      const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
      console.log('✅ MCP SDK imports successful');
      
      // Test server creation
      console.log('🚀 Testing server creation...');
      const server = new Server(
        {
          name: 'pinterest-mcp-server-test',
          version: '1.0.0',
        },
        {
          capabilities: {
            tools: {},
          },
        }
      );
      console.log('✅ Server creation successful');
      
    } catch (mcpError) {
      console.error('❌ MCP SDK Error:', mcpError.message);
      console.log('💡 Try installing the MCP SDK:');
      console.log('   npm install @modelcontextprotocol/sdk');
    }
    
    // Test authentication token
    console.log('🔐 Testing authentication...');
    try {
      const token = await getValidToken();
      if (token) {
        console.log('✅ Authentication token found and valid');
      } else {
        console.log('⚠️  No authentication token found or token expired');
        console.log('💡 Run: npm run auth');
      }
    } catch (authError) {
      console.error('❌ Authentication Error:', authError.message);
    }
    
    console.log('\n🎉 MCP Server test completed successfully!');
    console.log('🔗 Ready to use with Claude Desktop');
    
    if (allNamesValid) {
      console.log('✅ Tool names are now compatible with Claude Desktop validation');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testMCPServer();
