/**
 * MCP Socket.IO Protocol Implementation
 */
const { handleToolExecution } = require('./handlers');
const { mcp_tools } = require('./tools');

function setupSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log('MCP client connected');

        // Handle MCP list_tools request
        socket.on('list_tools', (message, callback) => {
            console.log('Received list_tools request', message);
            
            // Respond with available tools
            const response = {
            id: message.id,
            tools: mcp_tools
            };
            
            callback(response);
        });

        // Handle MCP call_tool request
        socket.on('call_tool', async (message, callback) => {
            console.log('Received call_tool request', message);
            
            const { name, parameters } = message.tool;
            
            try {
            const result = await handleToolExecution(name, parameters);
            
            // Respond with tool execution result
            const response = {
                id: message.id,
                result: result
            };
            
            callback(response);
            } catch (error) {
            console.error('Error executing tool:', error);
            
            // Respond with error
            const response = {
                id: message.id,
                error: {
                message: error.message,
                details: error.response?.data
                }
            };
            
            callback(response);
            }
        });

        socket.on('disconnect', () => {
            console.log('MCP client disconnected');
        });
    });
}

module.exports = {
  setupSocketHandlers
};
