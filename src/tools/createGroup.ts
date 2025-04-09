import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const createGroupTool: ToolSchema = {
  name: "create-group",
  description: "Create a new group on a Miro board",
  args: {
    boardId: z.string().describe("ID of the board where the group will be created"),
    data: z.object({
      items: z.array(z.string()).describe("List of item IDs to include in the group")
    }).describe("Group data with item IDs to include in the group")
  },
  fn: async ({ boardId, data }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!data || !data.items || data.items.length === 0) {
        return ServerResponse.error("At least one item ID is required in the 'items' array");
      }

      const result = await MiroClient.getApi().createGroup(boardId, { data });

      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      process.stderr.write(`Error creating group: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
}

export default createGroupTool;