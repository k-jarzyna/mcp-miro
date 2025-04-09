import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getCardItemTool: ToolSchema = {
  name: "get-card-item",
  description: "Retrieve information about a specific card item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the card"),
    itemId: z.string().describe("Unique identifier (ID) of the card that you want to retrieve")
  },
  fn: async ({ boardId, itemId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      const itemData = await MiroClient.getApi().getCardItem(boardId, itemId);

      return ServerResponse.text(JSON.stringify(itemData, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default getCardItemTool;