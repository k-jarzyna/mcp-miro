import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const removeBoardMemberTool: ToolSchema = {
  name: "remove-board-member",
  description: "Remove a specific member from a Miro board",
  args: {
    boardId: z.string().describe("ID of the board"),
    memberId: z.string().describe("ID of the board member to remove")
  },
  fn: async ({ boardId, memberId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!memberId) {
        return ServerResponse.error("Member ID is required");
      }

      const result = await MiroClient.getApi().removeBoardMember(boardId, memberId);

      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      process.stderr.write(`Error removing board member: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
}

export default removeBoardMemberTool;
