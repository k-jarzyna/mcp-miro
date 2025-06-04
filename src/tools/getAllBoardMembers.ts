import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getAllBoardMembersTool: ToolSchema = {
  name: "get-all-board-members",
  description: "Retrieve all members of a specific Miro board",
  args: {
    boardId: z.string().describe("ID of the board to retrieve members from"),
    limit: z.number().optional().nullable().describe("Maximum number of members to retrieve (default: 50)"),
    offset: z.number().optional().nullable().describe("Offset for pagination (default: 0)")
  },
  fn: async ({ boardId, limit = 50, offset = 0 }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      const result = await MiroClient.getApi().getBoardMembers(boardId, {
        limit: limit.toString(),
        offset: offset.toString()
      });

      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving board members: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
}

export default getAllBoardMembersTool;
