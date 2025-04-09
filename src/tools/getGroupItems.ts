import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getGroupItemsTool: ToolSchema = {
  name: "get-group-items",
  description: "Retrieve all items in a specific group on a Miro board",
  args: {
    boardId: z.string().describe("ID of the board that contains the group"),
    groupId: z.string().describe("ID of the group whose items you want to retrieve"),
    limit: z.number().optional().describe("Maximum number of items to return (default: 50)"),
    cursor: z.string().optional().describe("Cursor for pagination")
  },
  fn: async ({ boardId, groupId, limit, cursor }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!groupId) {
        return ServerResponse.error("Group ID is required");
      }

      const options: any = {};
      if (limit) options.limit = limit;
      if (cursor) options.cursor = cursor;

      const result = await MiroClient.getApi().getItemsByGroupId(boardId, groupId, options);

      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving group items: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
}

export default getGroupItemsTool;