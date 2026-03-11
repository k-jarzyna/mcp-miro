import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const itemTypeEnum = z.enum([
  'text', 'shape', 'sticky_note', 'image', 'document', 'card', 'app_card', 'preview', 'frame', 'embed'
]).optional().nullish();

const getItemsOnBoardTool: ToolSchema = {
  name: "get-items-on-board",
  description: "Retrieve all items on a specific Miro board. Use optional type (e.g. 'frame') to list only that item type without fetching everything. Uses cursor-based pagination.",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board whose items you want to retrieve"),
    type: itemTypeEnum.describe("Optional: return only items of this type (e.g. 'frame' to list only frames)"),
    limit: z.number().optional().nullish().describe("Maximum number of items to return per page (default: 50, range: 10-50)"),
    cursor: z.string().optional().nullish().describe("Cursor for pagination; use the cursor value from the previous response to retrieve the next page")
  },
  fn: async ({ boardId, type, limit = 50, cursor }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      type ItemType = 'text' | 'shape' | 'sticky_note' | 'image' | 'document' | 'card' | 'app_card' | 'preview' | 'frame' | 'embed';
      const options: { limit: string; cursor?: string; type?: ItemType } = {
        limit: limit.toString(),
      };
      if (cursor) options.cursor = cursor;
      if (type) options.type = type as ItemType;

      const itemsData = await MiroClient.getApi().getItems(boardId, options);

      return ServerResponse.text(JSON.stringify(itemsData, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default getItemsOnBoardTool;