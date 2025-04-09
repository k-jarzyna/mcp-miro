import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const attachTagTool: ToolSchema = {
  name: "attach-tag",
  description: "Attach a tag to an item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the tag and item"),
    tagId: z.string().describe("Unique identifier (ID) of the tag that you want to attach"),
    itemId: z.string().describe("Unique identifier (ID) of the item to which you want to attach the tag")
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

      await MiroClient.getApi().attachTagToItem(boardId, tagId, itemId);
      return ServerResponse.text(JSON.stringify({ success: true, message: "Tag attached successfully" }, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default attachTagTool;