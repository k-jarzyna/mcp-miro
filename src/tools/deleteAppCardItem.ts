import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const deleteAppCardItemTool: ToolSchema = {
  name: "delete-app-card-item",
  description: "Delete a specific app card item from a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the app card"),
    itemId: z.string().describe("Unique identifier (ID) of the app card that you want to delete")
  },
  fn: async ({ boardId, itemId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      await MiroClient.getApi().deleteAppCardItem(boardId, itemId);
      
      return ServerResponse.text(JSON.stringify({
        success: true,
        message: `App Card Item ${itemId} successfully deleted from board ${boardId}`
      }, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default deleteAppCardItemTool;