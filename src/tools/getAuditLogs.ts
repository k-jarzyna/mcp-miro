import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getAuditLogsTool: ToolSchema = {
  name: "get-audit-logs",
  description: "Retrieves a page of audit events from the last 90 days (Enterprise only)",
  args: {
    createdAfter: z.string().describe("Retrieve audit logs created after this date (ISO 8601 format)"),
    createdBefore: z.string().describe("Retrieve audit logs created before this date (ISO 8601 format)"),
    cursor: z.string().optional().nullish().describe("Cursor for pagination"),
    limit: z.number().optional().nullish().describe("Maximum number of results to return (default: 100)"),
    sorting: z.enum(["ASC", "DESC"]).optional().nullish().describe("Sort order for results (default: ASC)")
  },
  fn: async ({ createdAfter, createdBefore, cursor, limit, sorting }) => {
    try {
      const query: any = {};
      if (cursor) query.cursor = cursor;
      if (limit) query.limit = limit;
      if (sorting) query.sorting = sorting;

      const response = await MiroClient.getApi().enterpriseGetAuditLogs(
        createdAfter,
        createdBefore,
        query
      );

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving audit logs: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default getAuditLogsTool;