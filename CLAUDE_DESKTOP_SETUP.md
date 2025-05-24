# Pinterest MCP Server - Claude Desktop Setup Guide

This guide will help you set up the Pinterest MCP Server to work with Claude Desktop using the `claude_desktop_config.json` configuration.

## Prerequisites

1. Pinterest Developer Account and API credentials
2. Claude Desktop App installed
3. Node.js installed on your system

## Setup Steps

### 1. Install Dependencies

```bash
cd /path/to/your/mcp-server/pinterest-mcp-server
npm install
```

### 2. Configure Environment Variables

Make sure your `.env` file contains your Pinterest API credentials:

```
PINTEREST_APP_ID=your_pinterest_app_id
PINTEREST_APP_SECRET=your_pinterest_app_secret
REDIRECT_URI=http://localhost:8085/
```

### 3. Authenticate with Pinterest

Before using the MCP server with Claude Desktop, you need to authenticate:

```bash
npm run auth
```

This will:
- Start a local authentication server
- Open your browser to Pinterest's OAuth page
- Handle the authentication flow
- Save your tokens for the MCP server to use

### 4. Configure Claude Desktop

Edit your Claude Desktop configuration file:

**File Location:** `/path/to/your/claude/claude_desktop_config.json`

Add the following configuration:

```json
{
  "mcpServers": {
    "pinterest": {
      "command": "node",
      "args": ["/path/to/your/mcp-server/mcp-server.js"],
      "env": {
        "PINTEREST_APP_ID": "your_pinterest_app_id",
        "PINTEREST_APP_SECRET": "your_pinterest_app_secret",
        "REDIRECT_URI": "http://localhost:8085/"
      }
    }
  }
}
```

**Important Notes:**
- Replace `your_pinterest_app_id` and `your_pinterest_app_secret` with your actual credentials
- Use the full absolute path to your `mcp-server.js` file
- Make sure the path doesn't have any spaces or special characters that need escaping

### 5. Restart Claude Desktop

After saving the configuration:
1. Completely quit Claude Desktop
2. Restart Claude Desktop
3. The Pinterest MCP server should now be available

### 6. Test the Connection

In Claude Desktop, you can now ask questions like:
- "Show me my Pinterest user information"
- "List my Pinterest boards"
- "Create a new Pinterest board called 'AI Projects'"
- "What pins are on my first board?"

## Available Tools

The MCP server provides these tools:

- `pinterest.user.get_info` - Get your Pinterest user information
- `pinterest.boards.list` - List your Pinterest boards
- `pinterest.boards.create` - Create a new board
- `pinterest.boards.get` - Get details of a specific board
- `pinterest.pins.list` - List pins on a board
- `pinterest.pins.create` - Create a new pin
- `pinterest.pins.get` - Get details of a specific pin

## Troubleshooting

### Authentication Issues
- Make sure you've run `npm run auth` and completed the authentication flow
- Check that your Pinterest API credentials are correct in the `.env` file
- Verify that the redirect URI in your Pinterest app settings matches the one in your `.env`

### Claude Desktop Connection Issues
- Ensure the path in `claude_desktop_config.json` is correct and absolute
- Check that all environment variables are properly set in the config
- Restart Claude Desktop completely after making config changes
- Check Claude Desktop's logs for any error messages

### Token Expiration
- If you get authentication errors, re-run `npm run auth` to refresh your tokens
- Tokens are automatically refreshed, but if there are issues, manual re-authentication may be needed

## File Structure

```
pinterest-mcp-server/
├── mcp-server.js          # Stdio-based MCP server for Claude Desktop
├── auth-setup.js          # Authentication setup script
├── server.js              # Socket.IO-based server (for other uses)
├── src/
│   ├── api/               # Pinterest API functions
│   ├── auth/              # Authentication modules  
│   └── mcp/               # MCP protocol implementation
└── tokens/                # OAuth tokens storage
```

## Alternative Usage

You can still use the Socket.IO-based server for other applications:

```bash
npm start  # Starts the Socket.IO server on port 3052
```

This is useful for custom integrations or testing outside of Claude Desktop.
