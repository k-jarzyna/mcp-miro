import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getFrameItemTool: ToolSchema = {
  name: "get-frame-item",
  description: "Retrieve information for a specific frame on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the frame that you want to retrieve"),
    itemId: z.string().describe("Unique identifier (ID) of the frame that you want to retrieve")
  },
  fn: async ({ boardId, itemId }: {
    boardId: string,
    itemId: string
  }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      const result = await MiroClient.getApi().getFrameItem(boardId, itemId);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default getFrameItemTool;