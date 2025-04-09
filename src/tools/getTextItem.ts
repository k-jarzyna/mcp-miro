import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getTextItemTool: ToolSchema = {
  name: "get-text-item",
  description: "Retrieve information about a specific text item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the text item"),
    itemId: z.string().describe("Unique identifier (ID) of the text item that you want to retrieve")
  },
  fn: async ({ boardId, itemId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      const textData = await MiroClient.getApi().getTextItem(boardId, itemId);
      return ServerResponse.text(JSON.stringify(textData, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default getTextItemTool;