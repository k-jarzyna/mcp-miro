import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getStickyNoteItemTool: ToolSchema = {
  name: "get-sticky-note-item",
  description: "Retrieve information about a specific sticky note item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the sticky note"),
    itemId: z.string().describe("Unique identifier (ID) of the sticky note that you want to retrieve")
  },
  fn: async ({ boardId, itemId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      const stickyNoteData = await MiroClient.getApi().getStickyNoteItem(boardId, itemId);
      return ServerResponse.text(JSON.stringify(stickyNoteData, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default getStickyNoteItemTool;