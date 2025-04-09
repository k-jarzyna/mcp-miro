import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const deleteStickyNoteItemTool: ToolSchema = {
  name: "delete-sticky-note-item",
  description: "Delete a specific sticky note item from a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the sticky note"),
    itemId: z.string().describe("Unique identifier (ID) of the sticky note that you want to delete")
  },
  fn: async ({ boardId, itemId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      await MiroClient.getApi().deleteStickyNoteItem(boardId, itemId);
      return ServerResponse.text(JSON.stringify({ success: true, message: "Sticky note deleted successfully" }, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default deleteStickyNoteItemTool;