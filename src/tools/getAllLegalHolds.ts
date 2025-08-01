import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getLegalHoldsTool: ToolSchema = {
  name: "get-all-legal-holds",
  description: "Retrieves the list of all legal holds within a case (Enterprise only)",
  args: {
    limit: z.number().describe("The maximum number of items in the result list"),
    orgId: z.string().describe("The ID of the organization for which you want to retrieve the list of legal holds"),
    caseId: z.string().describe("The ID of the case for which you want to retrieve the list of legal holds"),
    cursor: z.string().optional().nullish().describe("Cursor for pagination")
  },
  fn: async ({ limit, orgId, caseId, cursor }) => {
    try {
      const query: any = {};
      if (cursor) query.cursor = cursor;

      const response = await MiroClient.getApi().getAllLegalHolds(limit, orgId, caseId, query);

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving legal holds: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default getLegalHoldsTool;