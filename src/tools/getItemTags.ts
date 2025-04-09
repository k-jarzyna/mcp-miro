import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getItemTagsTool: ToolSchema = {
  name: "get-item-tags",
  description: "Retrieve all tags attached to a specific item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the item"),
    itemId: z.string().describe("Unique identifier (ID) of the item whose tags you want to retrieve"),
  },
  fn: async ({ boardId, itemId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      const result = await MiroClient.getApi().getTagsFromItem(boardId, itemId);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default getItemTagsTool;