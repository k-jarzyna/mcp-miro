import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getTagTool: ToolSchema = {
  name: "get-tag",
  description: "Retrieve information about a specific tag on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the tag"),
    tagId: z.string().describe("Unique identifier (ID) of the tag that you want to retrieve")
  },
  fn: async ({ boardId, tagId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!tagId) {
        return ServerResponse.error("Tag ID is required");
      }

      const result = await MiroClient.getApi().getTag(boardId, tagId);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default getTagTool;