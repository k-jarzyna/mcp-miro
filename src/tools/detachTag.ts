import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const detachTagTool: ToolSchema = {
  name: "detach-tag",
  description: "Detach a tag from an item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the tag and item"),
    tagId: z.string().describe("Unique identifier (ID) of the tag that you want to detach"),
    itemId: z.string().describe("Unique identifier (ID) of the item from which you want to detach the tag")
  },
  fn: async ({ boardId, tagId, itemId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!tagId) {
        return ServerResponse.error("Tag ID is required");
      }

      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      // Use the SDK method to detach a tag from an item
      await MiroClient.getApi().removeTagFromItem(boardId, itemId, tagId);
      return ServerResponse.text(JSON.stringify({ success: true, message: "Tag detached successfully" }, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default detachTagTool;