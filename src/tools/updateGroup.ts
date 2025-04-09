import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const updateGroupTool: ToolSchema = {
  name: "update-group",
  description: "Update a specific group on a Miro board with new items",
  args: {
    boardId: z.string().describe("ID of the board that contains the group"),
    groupId: z.string().describe("ID of the group that you want to update"),
    data: z.object({
      items: z.array(z.string()).describe("Updated list of item IDs to include in the group")
    }).describe("Updated group data with item IDs to include in the group")
  },
  fn: async ({ boardId, groupId, data }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!groupId) {
        return ServerResponse.error("Group ID is required");
      }

      if (!data || !data.items || data.items.length === 0) {
        return ServerResponse.error("At least one item ID is required in the 'items' array");
      }

      const result = await MiroClient.getApi().updateGroup(boardId, groupId, { data });

      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      process.stderr.write(`Error updating group: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
}

export default updateGroupTool;