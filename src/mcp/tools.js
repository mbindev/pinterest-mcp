/**
 * MCP Tools Definition
 */

// MCP tools definition (Fixed names for Claude Desktop compatibility)
const mcp_tools = [
  {
    name: 'pinterest_user_get_info',
    description: 'Get information about the authenticated Pinterest user',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'pinterest_boards_list',
    description: 'List boards for the authenticated user',
    inputSchema: {
      type: 'object',
      properties: {
        pageSize: {
          type: 'number',
          description: 'Number of boards to return per page (max 100)'
        },
        bookmark: {
          type: 'string',
          description: 'Bookmark for pagination'
        }
      }
    }
  },
  {
    name: 'pinterest_boards_create',
    description: 'Create a new Pinterest board',
    inputSchema: {
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          type: 'string',
          description: 'Name of the board'
        },
        description: {
          type: 'string',
          description: 'Description of the board'
        },
        privacy: {
          type: 'string',
          enum: ['PUBLIC', 'PROTECTED', 'SECRET'],
          description: 'Privacy setting for the board (PUBLIC, PROTECTED, or SECRET)'
        }
      }
    }
  },
  {
    name: 'pinterest_boards_get',
    description: 'Get details of a specific Pinterest board',
    inputSchema: {
      type: 'object',
      required: ['boardId'],
      properties: {
        boardId: {
          type: 'string',
          description: 'ID of the Pinterest board'
        }
      }
    }
  },
  {
    name: 'pinterest_pins_list',
    description: 'List pins on a Pinterest board',
    inputSchema: {
      type: 'object',
      required: ['boardId'],
      properties: {
        boardId: {
          type: 'string',
          description: 'ID of the Pinterest board'
        },
        pageSize: {
          type: 'number',
          description: 'Number of pins to return per page (max 100)'
        },
        bookmark: {
          type: 'string',
          description: 'Bookmark for pagination'
        }
      }
    }
  },
  {
    name: 'pinterest_pins_create',
    description: 'Create a new Pinterest pin',
    inputSchema: {
      type: 'object',
      required: ['board_id', 'media_source'],
      properties: {
        board_id: {
          type: 'string',
          description: 'ID of the Pinterest board to pin to'
        },
        media_source: {
          type: 'object',
          required: ['source_type'],
          properties: {
            source_type: {
              type: 'string',
              enum: ['image_url', 'image_base64'],
              description: 'Type of media source (image_url or image_base64)'
            },
            url: {
              type: 'string',
              description: 'URL of the image (required if source_type is image_url)'
            },
            content_type: {
              type: 'string',
              description: 'MIME type of the image (e.g., image/jpeg, image/png)'
            },
            data: {
              type: 'string',
              description: 'Base64-encoded image data (required if source_type is image_base64)'
            }
          }
        },
        title: {
          type: 'string',
          description: 'Title of the pin'
        },
        description: {
          type: 'string',
          description: 'Description of the pin'
        },
        link: {
          type: 'string',
          description: 'Link associated with the pin'
        },
        alt_text: {
          type: 'string',
          description: 'Alt text for the pin image'
        }
      }
    }
  },
  {
    name: 'pinterest_pins_get',
    description: 'Get details of a specific Pinterest pin',
    inputSchema: {
      type: 'object',
      required: ['pinId'],
      properties: {
        pinId: {
          type: 'string',
          description: 'ID of the Pinterest pin'
        }
      }
    }
  }
];

module.exports = {
  mcp_tools
};
