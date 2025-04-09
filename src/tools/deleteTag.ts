import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const deleteTagTool: ToolSchema = {
  name: "delete-tag",
  description: "Delete a specific tag from a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the tag"),
    tagId: z.string().describe("Unique identifier (ID) of the tag that you want to delete")
  },
  fn: async ({ boardId, tagId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!tagId) {
        return ServerResponse.error("Tag ID is required");
      }

      await MiroClient.getApi().deleteTag(boardId, tagId);
      return ServerResponse.text(JSON.stringify({ success: true, message: "Tag deleted successfully" }, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default deleteTagTool;