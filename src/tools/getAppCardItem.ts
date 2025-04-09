import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getAppCardItemTool: ToolSchema = {
  name: "get-app-card-item",
  description: "Retrieve information about a specific app card item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the app card"),
    itemId: z.string().describe("Unique identifier (ID) of the app card that you want to retrieve")
  },
  fn: async ({ boardId, itemId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      const itemData = await MiroClient.getApi().getAppCardItem(boardId, itemId);

      return ServerResponse.text(JSON.stringify(itemData, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default getAppCardItemTool;