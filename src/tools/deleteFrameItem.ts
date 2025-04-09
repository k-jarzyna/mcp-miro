import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const deleteFrameItemTool: ToolSchema = {
  name: "delete-frame-item",
  description: "Delete a frame from a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board from which you want to delete the frame"),
    itemId: z.string().describe("Unique identifier (ID) of the frame that you want to delete")
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

      await MiroClient.getApi().deleteFrameItem(boardId, itemId);
      return ServerResponse.text(JSON.stringify({ success: true, message: "Frame successfully deleted" }, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default deleteFrameItemTool;