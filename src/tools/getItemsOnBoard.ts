import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getItemsOnBoardTool: ToolSchema = {
  name: "get-items-on-board",
  description: "Retrieve all items on a specific Miro board. Uses cursor-based pagination: pass the cursor from the previous response to get the next page.",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board whose items you want to retrieve"),
    limit: z.number().optional().nullish().describe("Maximum number of items to return per page (default: 50, range: 10-50)"),
    cursor: z.string().optional().nullish().describe("Cursor for pagination; use the cursor value from the previous response to retrieve the next page")
  },
  fn: async ({ boardId, limit = 50, cursor }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      const options: { limit: string; cursor?: string } = {
        limit: limit.toString(),
      };
      if (cursor) options.cursor = cursor;

      const itemsData = await MiroClient.getApi().getItems(boardId, options);

      return ServerResponse.text(JSON.stringify(itemsData, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default getItemsOnBoardTool;