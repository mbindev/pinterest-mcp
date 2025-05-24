#!/usr/bin/env node

/**
 * Pinterest MCP Server - Stdio Version (Fixed Schemas)
 * 
 * This is a stdio-based MCP server that works with Claude Desktop.
 * It communicates via standard input/output using the official MCP protocol.
 */

// Import required modules
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { 
  ListToolsRequestSchema, 
  CallToolRequestSchema 
} = require('@modelcontextprotocol/sdk/types.js');

// Import our existing modules
const { getUserInfo } = require('./src/api/user');
const { listBoards, createBoard, getBoardDetails } = require('./src/api/boards');
const { listPins, createPin, getPinDetails } = require('./src/api/pins');
const { getValidToken } = require('./src/auth/oauth');
const { mcp_tools } = require('./src/mcp/tools');

// Tool execution handler (updated with new tool names)
async function executeToolHandler(name, parameters) {
  try {
    const token = await getValidToken();
    
    if (!token) {
      throw new Error('Not authenticated. Please run the authentication server first.');
    }

    switch (name) {
      case 'pinterest_user_get_info':
        return await getUserInfo(token.access_token);
      
      case 'pinterest_boards_list':
        return await listBoards(token.access_token, parameters);
      
      case 'pinterest_boards_create':
        return await createBoard(token.access_token, parameters);
      
      case 'pinterest_boards_get':
        return await getBoardDetails(token.access_token, parameters.boardId);
      
      case 'pinterest_pins_list':
        return await listPins(token.access_token, parameters.boardId, parameters);
      
      case 'pinterest_pins_create':
        return await createPin(token.access_token, parameters);
      
      case 'pinterest_pins_get':
        return await getPinDetails(token.access_token, parameters.pinId);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error('Tool execution error:', error);
    throw error;
  }
}

// Create MCP server instance
const server = new Server(
  {
    name: 'pinterest-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Set up the list tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: mcp_tools,
  };
});

// Set up the call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    const result = await executeToolHandler(name, args || {});
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text', 
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log server startup (this goes to stderr, not stdout which is used for MCP communication)
  console.error('Pinterest MCP Server (stdio) started');
}

// Handle process termination
process.on('SIGINT', async () => {
  console.error('Shutting down Pinterest MCP Server...');
  await server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error('Shutting down Pinterest MCP Server...');
  await server.close();
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
main().catch((error) => {
  console.error('Failed to start Pinterest MCP Server:', error);
  process.exit(1);
});
