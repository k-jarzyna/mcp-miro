import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getMindmapNodeTool: ToolSchema = {
  name: "get-mindmap-node",
  description: "Retrieve information about a specific mind map node on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board from which you want to retrieve a mind map node"),
    itemId: z.string().describe("Unique identifier (ID) of the mind map node that you want to retrieve")
  },
  fn: async ({ boardId, itemId }) => {
    try {
      const response = await MiroClient.getApi().getMindmapNodeExperimental(boardId, itemId);

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving Miro mind map node: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default getMindmapNodeTool;