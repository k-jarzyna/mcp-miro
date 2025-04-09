import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const deleteBoardTool: ToolSchema = {
  name: "delete-board",
  description: "Delete a Miro board by its ID. Deleted boards go to Trash (on paid plans) and can be restored via UI within 90 days after deletion.",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that you want to delete")
  },
  fn: async ({ boardId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      await MiroClient.getApi().deleteBoard(boardId);

      return ServerResponse.text(JSON.stringify({ 
        success: true, 
        message: `Board ${boardId} has been successfully deleted.` 
      }, null, 2));
    } catch (error) {
      process.stderr.write(`Error deleting Miro board: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
}

export default deleteBoardTool;