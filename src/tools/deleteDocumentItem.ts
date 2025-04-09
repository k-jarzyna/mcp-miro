import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const deleteDocumentItemTool: ToolSchema = {
  name: "delete-document-item",
  description: "Delete a specific document item from a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the document"),
    itemId: z.string().describe("Unique identifier (ID) of the document that you want to delete")
  },
  fn: async ({ boardId, itemId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      await MiroClient.getApi().deleteDocumentItem(boardId, itemId);
      return ServerResponse.text(JSON.stringify({ success: true, message: "Document item successfully deleted" }));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default deleteDocumentItemTool;