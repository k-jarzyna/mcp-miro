import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const deleteMindmapNodeTool: ToolSchema = {
  name: "delete-mindmap-node",
  description: "Delete a mind map node from a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board from which you want to delete the mind map node"),
    itemId: z.string().describe("Unique identifier (ID) of the mind map node that you want to delete")
  },
  fn: async ({ boardId, itemId }) => {
    try {
      const response = await MiroClient.getApi().deleteMindmapNodeExperimental(boardId, itemId);

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error deleting Miro mind map node: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default deleteMindmapNodeTool;