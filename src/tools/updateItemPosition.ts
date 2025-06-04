import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const updateItemPositionTool: ToolSchema = {
  name: "update-item-position",
  description: "Update the position or parent of a specific item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the item"),
    itemId: z.string().describe("Unique identifier (ID) of the item that you want to update"),
    position: z.object({
      x: z.number().optional().nullable().describe("X coordinate of the item"),
      y: z.number().optional().nullable().describe("Y coordinate of the item")
    }).optional().nullable().describe("New position coordinates for the item"),
    parentId: z.string().optional().nullable().describe("Unique identifier (ID) of the new parent item")
  },
  fn: async ({ boardId, itemId, position, parentId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }
      
      const updateData = {};
      
      if (position) {
        updateData['position'] = position;
      }
      
      if (parentId) {
        updateData['parent'] = { id: parentId };
      }
      
      if (Object.keys(updateData).length === 0) {
        return ServerResponse.error("At least one update parameter (position or parentId) is required");
      }

      const updatedItem = await MiroClient.getApi().updateItemPositionOrParent(boardId, itemId, updateData);

      return ServerResponse.text(JSON.stringify(updatedItem, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default updateItemPositionTool;