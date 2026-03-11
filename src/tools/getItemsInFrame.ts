import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const itemTypeEnum = z.enum([
  'text', 'shape', 'sticky_note', 'image', 'document', 'card', 'app_card', 'preview', 'frame', 'embed'
]).optional().nullish();

const getItemsInFrameTool: ToolSchema = {
  name: "get-items-in-frame",
  description: "Retrieve all items inside a specific frame on a Miro board. Use optional type to filter by item type. Uses cursor-based pagination.",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the frame"),
    frameId: z.string().describe("Unique identifier (ID) of the frame whose items you want to retrieve"),
    type: itemTypeEnum.describe("Optional: return only items of this type inside the frame"),
    limit: z.number().optional().nullish().describe("Maximum number of items to return per page (default: 50, range: 10-50)"),
    cursor: z.string().optional().nullish().describe("Cursor for pagination; use the cursor value from the previous response to retrieve the next page")
  },
  fn: async ({ boardId, frameId, type, limit = 50, cursor }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      if (!frameId) {
        return ServerResponse.error("Frame ID is required");
      }

      const options: { limit: string; cursor?: string; type?: string } = {
        limit: limit.toString(),
      };
      if (cursor) options.cursor = cursor;
      if (type) options.type = type;

      const itemsData = await MiroClient.getApi().getItemsWithinFrame(boardId, frameId, options);

      return ServerResponse.text(JSON.stringify(itemsData, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
};

export default getItemsInFrameTool;
