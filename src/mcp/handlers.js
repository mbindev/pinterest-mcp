/**
 * MCP Tool Execution Handlers
 * 
 * This module handles the execution of MCP tools by dispatching to the appropriate API functions.
 */

// Import API modules
const { getUserInfo } = require('../api/user');
const { listBoards, createBoard, getBoardDetails } = require('../api/boards');
const { listPins, createPin, getPinDetails } = require('../api/pins');

// Import authentication modules
const { getValidToken } = require('../auth/oauth');

/**
 * Handles execution of MCP tools
 * @param {string} toolName Name of the tool to execute
 * @param {Object} parameters Parameters for the tool
 * @returns {Promise<Object>} Result of the tool execution
 */
async function handleToolExecution(toolName, parameters) {
  try {
    const token = await getValidToken();
    
    if (!token) {
      return {
        error: 'Not authenticated. Please authenticate first.'
      };
    }

    switch (toolName) {
      case 'pinterest.user.get_info':
        return await getUserInfo(token.access_token);
      
      case 'pinterest.boards.list':
        return await listBoards(token.access_token, parameters);
      
      case 'pinterest.boards.create':
        return await createBoard(token.access_token, parameters);
      
      case 'pinterest.boards.get':
        return await getBoardDetails(token.access_token, parameters.boardId);
      
      case 'pinterest.pins.list':
        return await listPins(token.access_token, parameters.boardId, parameters);
      
      case 'pinterest.pins.create':
        return await createPin(token.access_token, parameters);
      
      case 'pinterest.pins.get':
        return await getPinDetails(token.access_token, parameters.pinId);
      
      default:
        return {
          error: `Unknown tool: ${toolName}`
        };
    }
  } catch (error) {
    return {
      error: error.message,
      details: error.response?.data
    };
  }
}

module.exports = {
  handleToolExecution
};
