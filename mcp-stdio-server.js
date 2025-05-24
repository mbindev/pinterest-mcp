#!/usr/bin/env node

/**
 * Pinterest MCP Server - Stdio Version
 * 
 * This version implements the MCP protocol over stdio for Claude Desktop integration.
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} = require('@modelcontextprotocol/sdk/types.js');

// Import our existing modules
const { getValidToken } = require('./src/auth/oauth');
const { handleToolExecution } = require('./src/mcp/handlers');
const { mcp_tools } = require('./src/mcp/tools');

// Create MCP server
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

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: mcp_tools,
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: parameters } = request.params;
  
  try {
    // Check authentication
    const token = await getValidToken();
    
    if (!token) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        'Not authenticated. Please run the authentication flow first.'
      );
    }
    
    // Execute the tool
    const result = await handleToolExecution(name, parameters || {});
    
    // Check if result contains an error
    if (result.error) {
      throw new McpError(
        ErrorCode.InternalError,
        result.error,
        result.details
      );
    }
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    
    throw new McpError(
      ErrorCode.InternalError,
      `Error executing tool ${name}: ${error.message}`,
      error.response?.data
    );
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Pinterest MCP Server running on stdio');
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
}

module.exports = { server };
