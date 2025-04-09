import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const deleteShapeItemTool: ToolSchema = {
  name: "delete-shape-item",
  description: "Delete a specific shape item from a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the shape"),
    itemId: z.string().describe("Unique identifier (ID) of the shape that you want to delete")
  },
  fn: async ({ boardId, itemId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      await MiroClient.getApi().deleteShapeItem(boardId, itemId);
      return ServerResponse.text(JSON.stringify({ success: true, message: "Shape deleted successfully" }, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default deleteShapeItemTool;