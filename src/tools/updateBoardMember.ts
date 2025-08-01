import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const updateBoardMemberTool: ToolSchema = {
  name: "update-board-member",
  description: "Update a specific member's role or status on a Miro board",
  args: {
    boardId: z.string().describe("ID of the board"),
    memberId: z.string().describe("ID of the board member to update"),
    role: z.enum(['member', 'admin', 'owner']).optional().nullish().describe("New role for the board member"),
    status: z.enum(['active', 'pending', 'blocked']).optional().nullish().describe("New status for the board member")
  },
  fn: async ({ boardId, memberId, role, status }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!memberId) {
        return ServerResponse.error("Member ID is required");
      }

      if (!role && !status) {
        return ServerResponse.error("At least one of role or status must be provided");
      }

      const memberChanges: any = {};
      if (role) memberChanges.role = role;
      if (status) memberChanges.status = status;

      const result = await MiroClient.getApi().updateBoardMember(boardId, memberId, memberChanges);

      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      process.stderr.write(`Error updating board member: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
}

export default updateBoardMemberTool;
