import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getEmbedItemTool: ToolSchema = {
  name: "get-embed-item",
  description: "Retrieve information about a specific embed item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the embed"),
    itemId: z.string().describe("Unique identifier (ID) of the embed that you want to retrieve")
  },
  fn: async ({ boardId, itemId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      const result = await MiroClient.getApi().getEmbedItem(boardId, itemId);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default getEmbedItemTool;