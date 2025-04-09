import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getMindmapNodesTool: ToolSchema = {
  name: "get-mindmap-nodes",
  description: "Retrieve a list of mind map nodes on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board from which you want to retrieve mind map nodes"),
    limit: z.number().optional().describe("Maximum number of results to return (default: 50)"),
    cursor: z.string().optional().describe("Cursor for pagination")
  },
  fn: async ({ boardId, limit, cursor }) => {
    try {
      // Prepare query parameters
      const query: any = {};
      if (limit) query.limit = limit.toString();
      if (cursor) query.cursor = cursor;

      const response = await MiroClient.getApi().getMindmapNodesExperimental(boardId, query);

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving Miro mind map nodes: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default getMindmapNodesTool;