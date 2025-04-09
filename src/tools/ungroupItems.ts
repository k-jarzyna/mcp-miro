import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const ungroupItemsTool: ToolSchema = {
  name: "ungroup-items",
  description: "Ungroup a specific group on a Miro board",
  args: {
    boardId: z.string().describe("ID of the board that contains the group"),
    groupId: z.string().describe("ID of the group that you want to ungroup"),
    deleteItems: z.boolean().optional().describe("Indicates whether the items should be removed. By default, false.")
  },
  fn: async ({ boardId, groupId, deleteItems }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!groupId) {
        return ServerResponse.error("Group ID is required");
      }

      const options: any = {};
      if (deleteItems !== undefined) options.deleteItems = deleteItems;

      await MiroClient.getApi().unGroup(boardId, groupId, options);

      return ServerResponse.text(JSON.stringify({ success: true, message: "Group successfully ungrouped" }, null, 2));
    } catch (error) {
      process.stderr.write(`Error ungrouping items: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
}

export default ungroupItemsTool;