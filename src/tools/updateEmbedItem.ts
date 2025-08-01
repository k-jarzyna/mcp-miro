import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const updateEmbedItemTool: ToolSchema = {
  name: "update-embed-item",
  description: "Update an existing embed item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the embed"),
    itemId: z.string().describe("Unique identifier (ID) of the embed that you want to update"),
    data: z.object({
      mode: z.string().optional().nullish().describe("Updated mode of the embed (normal, inline, etc.)")
    }).optional().nullish().describe("The updated configuration of the embed"),
    position: z.object({
      x: z.number().describe("Updated X coordinate of the embed"),
      y: z.number().describe("Updated Y coordinate of the embed"),
      origin: z.string().optional().nullish().describe("Origin of the embed (center, top-left, etc.)"),
      relativeTo: z.string().optional().nullish().describe("Reference point (canvas_center, etc.)")
    }).optional().nullish().describe("Updated position of the embed on the board"),
    geometry: z.object({
      width: z.number().optional().nullish().describe("Updated width of the embed"),
      height: z.number().optional().nullish().describe("Updated height of the embed")
    })
    .optional().nullish()
    .refine(data => !data || data.width !== undefined || data.height !== undefined, {
      message: "Either width or height must be provided if geometry is set"
    })
    .refine(data => !data || !(data.width !== undefined && data.height !== undefined), {
      message: "Only one of width or height should be provided for items with fixed aspect ratio"
    })
    .describe("Updated dimensions of the embed")
  },
  fn: async ({ boardId, itemId, data, position, geometry }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      const updateRequest: Record<string, any> = {};
      
      if (data) {
        updateRequest.data = data;
      }
      
      if (position) {
        updateRequest.position = position;
      }
      
      if (geometry) {
        updateRequest.geometry = geometry;
      }

      const result = await MiroClient.getApi().updateEmbedItem(boardId, itemId, updateRequest);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default updateEmbedItemTool;