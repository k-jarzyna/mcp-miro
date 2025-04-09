import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getBoardContentLogsTool: ToolSchema = {
  name: "get-board-content-logs",
  description: "Retrieves content change logs of board items (Enterprise only)",
  args: {
    orgId: z.string().describe("Unique identifier of the organization"),
    from: z.string().describe("Start date for filtering (ISO 8601 format)"),
    to: z.string().describe("End date for filtering (ISO 8601 format)"),
    boardIds: z.array(z.string()).optional().describe("List of board IDs to filter by"),
    emails: z.array(z.string()).optional().describe("List of user emails to filter by"),
    cursor: z.string().optional().describe("Cursor for pagination"),
    limit: z.number().optional().describe("Maximum number of results to return"),
    sorting: z.enum(["asc", "desc"]).optional().describe("Sort order for results")
  },
  fn: async ({ orgId, from, to, boardIds, emails, cursor, limit, sorting }) => {
    try {
      const query: any = {};
      if (boardIds) query.boardIds = boardIds;
      if (emails) query.emails = emails;
      if (cursor) query.cursor = cursor;
      if (limit) query.limit = limit;
      if (sorting) query.sorting = sorting;

      // Convert string dates to Date objects
      const fromDate = new Date(from);
      const toDate = new Date(to);

      const response = await MiroClient.getApi().enterpriseBoardContentItemLogsFetch(
        orgId,
        fromDate,
        toDate,
        query
      );

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving board content logs: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default getBoardContentLogsTool;