import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getSpecificBoardTool: ToolSchema = {
  name: "get-specific-board",
  description: "Retrieve information about a specific Miro board by its ID",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that you want to retrieve")
  },
  fn: async ({ boardId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      const boardData = await MiroClient.getApi().getSpecificBoard(boardId);

      return ServerResponse.text(JSON.stringify(boardData, null, 2));
    } catch (error) {
      process.stderr.write(`Error fetching specific Miro board: ${error}\n`);

      return ServerResponse.error(error);
    }
  }
}

export default getSpecificBoardTool;