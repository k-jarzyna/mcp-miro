import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getAllGroupsTool: ToolSchema = {
  name: "get-all-groups",
  description: "Retrieve all groups on a Miro board",
  args: {
    boardId: z.string().describe("ID of the board whose groups you want to retrieve"),
    limit: z.number().optional().nullable().describe("Maximum number of groups to return (default: 50)"),
    cursor: z.string().optional().nullable().describe("Cursor for pagination")
  },
  fn: async ({ boardId, limit, cursor }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      const options: any = {};
      if (limit) options.limit = limit;
      if (cursor) options.cursor = cursor;

      const result = await MiroClient.getApi().getAllGroups(boardId, options);

      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving groups: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
}

export default getAllGroupsTool;