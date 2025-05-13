# Pinterest MCP Server

A Model Context Protocol (MCP) server for integrating the Pinterest API with AI agents and LLMs.

## Overview

This MCP server allows AI agents to interact with the Pinterest API in a standardized way, enabling functionalities like:

- Retrieving user information
- Managing Pinterest boards (listing, creating, viewing)
- Managing pins (listing, creating, viewing)

## Prerequisites

- Node.js (v14 or newer)
- Pinterest Developer Account
- Pinterest API App credentials

## Setup

1. Clone this repository:
```bash
git clone https://github.com/yourusername/pinterest-mcp-server.git
cd pinterest-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the template:
```bash
cp .env.template .env
```

4. Edit the `.env` file with your Pinterest API credentials:
```
PINTEREST_APP_ID=your_pinterest_app_id
PINTEREST_APP_SECRET=your_pinterest_app_secret
```

5. Register your application on the [Pinterest Developer Platform](https://developers.pinterest.com/apps/)
   - Add `http://localhost:8085/` as an authorized redirect URI

## Usage

1. Start the MCP server:
```bash
npm start
```

2. If no authentication token exists, the server will automatically open a browser window for authentication.

3. After successful authentication, the MCP server will be ready to accept connections from AI agents.

## Connecting with AI Agents

The MCP server implements the MCP protocol over Socket.IO and exposes the following tools:

- `pinterest.user.get_info` - Get user information
- `pinterest.boards.list` - List user's boards
- `pinterest.boards.create` - Create a new board
- `pinterest.boards.get` - Get board details
- `pinterest.pins.list` - List pins on a board
- `pinterest.pins.create` - Create a new pin
- `pinterest.pins.get` - Get pin details

You can connect your AI agents to this MCP server using compatible MCP client libraries.

## Example (Claude.ai Desktop App)

1. Make sure your MCP server is running
2. Open Claude Desktop App
3. Click on "Connect local tools" (bottom right)
4. Enter `http://localhost:3052` as the server URL
5. You can now ask Claude to perform Pinterest actions like:
   - "List my Pinterest boards"
   - "Create a new Pinterest board called 'Vacation Ideas'"
   - "Pin this image to my Travel board"

## License

MIT