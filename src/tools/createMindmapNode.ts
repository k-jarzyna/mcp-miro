import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const createMindmapNodeTool: ToolSchema = {
  name: "create-mindmap-node",
  description: "Create a new mind map node on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board where you want to create the node"),
    data: z.object({
      content: z.string().describe("Text content for the mind map node"),
      parentId: z.string().optional().describe("ID of the parent node (if this is a child node)"),
      style: z.object({
        fillColor: z.string().optional().describe("Fill color for the node"),
        textColor: z.string().optional().describe("Text color for the node")
      }).optional()
    }).describe("The content and style configuration of the mind map node"),
    position: z.object({
      x: z.number().describe("X coordinate of the node"),
      y: z.number().describe("Y coordinate of the node")
    }).describe("Position of the node on the board")
  },
  fn: async ({ boardId, data, position }) => {
    try {
      // Prepare the request data
      const mindmapCreateRequest = {
        data: {
          nodeView: {
            data: {
              type: "text",
              content: data.content
            }
          },
          ...(data.parentId && { parentId: data.parentId }),
          ...(data.style && { style: data.style })
        },
        position
      };

      // Call the Miro API to create a mind map node
      const response = await MiroClient.getApi().createMindmapNodesExperimental(boardId, mindmapCreateRequest);

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error creating Miro mind map node: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default createMindmapNodeTool;