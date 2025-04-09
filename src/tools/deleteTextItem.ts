import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const deleteTextItemTool: ToolSchema = {
  name: "delete-text-item",
  description: "Delete a specific text item from a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the text item"),
    itemId: z.string().describe("Unique identifier (ID) of the text item that you want to delete")
  },
  fn: async ({ boardId, itemId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      await MiroClient.getApi().deleteTextItem(boardId, itemId);
      return ServerResponse.text(JSON.stringify({ success: true, message: "Text item successfully deleted" }));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default deleteTextItemTool;