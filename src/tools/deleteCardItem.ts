import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const deleteCardItemTool: ToolSchema = {
  name: "delete-card-item",
  description: "Delete a specific card item from a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the card"),
    itemId: z.string().describe("Unique identifier (ID) of the card that you want to delete")
  },
  fn: async ({ boardId, itemId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      await MiroClient.getApi().deleteCardItem(boardId, itemId);
      
      return ServerResponse.text(JSON.stringify({
        success: true,
        message: `Card Item ${itemId} successfully deleted from board ${boardId}`
      }, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default deleteCardItemTool;