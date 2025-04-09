import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getDocumentItemTool: ToolSchema = {
  name: "get-document-item",
  description: "Retrieve information about a specific document item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the document"),
    itemId: z.string().describe("Unique identifier (ID) of the document that you want to retrieve")
  },
  fn: async ({ boardId, itemId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      const documentData = await MiroClient.getApi().getDocumentItem(boardId, itemId);
      return ServerResponse.text(JSON.stringify(documentData, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default getDocumentItemTool;