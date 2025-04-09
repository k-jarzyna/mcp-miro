import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getConnectorsTool: ToolSchema = {
  name: "get-connectors",
  description: "Retrieve all connectors on a specific Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board whose connectors you want to retrieve"),
    limit: z.number().optional().describe("Maximum number of connectors to return (default: 50)"),
    cursor: z.string().optional().describe("Cursor for pagination")
  },
  fn: async ({ boardId, limit, cursor }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      const queryParams: { limit?: string; cursor?: string } = {};
      if (limit) queryParams.limit = limit.toString();
      if (cursor) queryParams.cursor = cursor;

      const connectorsData = await MiroClient.getApi().getConnectors(boardId, queryParams);
      return ServerResponse.text(JSON.stringify(connectorsData, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default getConnectorsTool;