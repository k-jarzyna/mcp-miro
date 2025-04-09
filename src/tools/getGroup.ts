import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getGroupTool: ToolSchema = {
  name: "get-group",
  description: "Retrieve information about a specific group on a Miro board",
  args: {
    boardId: z.string().describe("ID of the board that contains the group"),
    groupId: z.string().describe("ID of the group that you want to retrieve")
  },
  fn: async ({ boardId, groupId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!groupId) {
        return ServerResponse.error("Group ID is required");
      }

      const result = await MiroClient.getApi().getGroupById(boardId, groupId);

      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving group: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
}

export default getGroupTool;