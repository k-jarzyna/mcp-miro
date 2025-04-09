import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const deleteItemTool: ToolSchema = {
  name: "delete-item",
  description: "Delete a specific item from a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the item"),
    itemId: z.string().describe("Unique identifier (ID) of the item that you want to delete")
  },
  fn: async ({ boardId, itemId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      await MiroClient.getApi().deleteItem(boardId, itemId);

      return ServerResponse.text(JSON.stringify({ 
        success: true, 
        message: `Item ${itemId} successfully deleted from board ${boardId}` 
      }, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default deleteItemTool;