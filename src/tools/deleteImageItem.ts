import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const deleteImageItemTool: ToolSchema = {
  name: "delete-image-item",
  description: "Delete a specific image item from a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the image"),
    itemId: z.string().describe("Unique identifier (ID) of the image that you want to delete")
  },
  fn: async ({ boardId, itemId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      // Use generic deleteItem
      await MiroClient.getApi().deleteItem(boardId, itemId);
      return ServerResponse.text(JSON.stringify({ success: true, message: "Image deleted successfully" }, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default deleteImageItemTool;