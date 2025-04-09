import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getSpecificBoardMemberTool: ToolSchema = {
  name: "get-specific-board-member",
  description: "Retrieve details of a specific member on a Miro board",
  args: {
    boardId: z.string().describe("ID of the board"),
    memberId: z.string().describe("ID of the specific board member to retrieve")
  },
  fn: async ({ boardId, memberId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!memberId) {
        return ServerResponse.error("Member ID is required");
      }

      const result = await MiroClient.getApi().getSpecificBoardMember(boardId, memberId);

      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving specific board member: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
}

export default getSpecificBoardMemberTool;
