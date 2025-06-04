import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getAllTagsTool: ToolSchema = {
  name: "get-all-tags",
  description: "Retrieve all tags on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board for which you want to retrieve all tags"),
    limit: z.number().optional().nullable().describe("Maximum number of tags to return (default: 50)"),
    offset: z.number().optional().nullable().describe("Offset for pagination (default: 0)")
  },
  fn: async ({ boardId, limit, offset }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      const query: Record<string, any> = {};
      
      if (limit !== undefined) {
        query.limit = limit;
      }
      
      if (offset !== undefined) {
        query.offset = offset;
      }

      const result = await MiroClient.getApi().getTagsFromBoard(boardId, query);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default getAllTagsTool;