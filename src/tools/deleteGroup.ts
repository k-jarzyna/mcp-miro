import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const deleteGroupTool: ToolSchema = {
  name: "delete-group",
  description: "Delete a specific group from a Miro board",
  args: {
    boardId: z.string().describe("ID of the board that contains the group"),
    groupId: z.string().describe("ID of the group that you want to delete"),
    deleteItems: z.boolean().optional().nullish().describe("Indicates whether the items should be removed. Set to true to delete items in the group, false to keep them")
  },
  fn: async ({ boardId, groupId, deleteItems }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!groupId) {
        return ServerResponse.error("Group ID is required");
      }

      await MiroClient.getApi().deleteGroup(boardId, groupId, deleteItems ?? false);

      return ServerResponse.text(JSON.stringify({ success: true, message: "Group successfully deleted" }, null, 2));
    } catch (error) {
      process.stderr.write(`Error deleting group: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
}

export default deleteGroupTool;