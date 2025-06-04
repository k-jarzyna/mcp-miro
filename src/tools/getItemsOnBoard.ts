import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getItemsOnBoardTool: ToolSchema = {
  name: "get-items-on-board",
  description: "Retrieve all items on a specific Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board whose items you want to retrieve"),
    limit: z.number().optional().nullable().describe("Maximum number of items to return (default: 50)"),
    offset: z.number().optional().nullable().describe("Offset for pagination (default: 0)")
  },
  fn: async ({ boardId, limit = 50, offset = 0 }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      const itemsData = await MiroClient.getApi().getItems(boardId, {
        limit: limit.toString(),
      });

      return ServerResponse.text(JSON.stringify(itemsData, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default getItemsOnBoardTool;