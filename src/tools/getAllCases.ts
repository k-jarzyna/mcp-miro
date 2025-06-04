import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getAllCasesTool: ToolSchema = {
  name: "get-all-cases",
  description: "Retrieves the list of eDiscovery cases in an organization (Enterprise only)",
  args: {
    limit: z.number().describe("The maximum number of items in the result list"),
    orgId: z.string().describe("The ID of the organization for which you want to retrieve the list of cases"),
    cursor: z.string().optional().nullable().describe("Cursor for pagination")
  },
  fn: async ({ limit, orgId, cursor }) => {
    try {
      const query: any = {};
      if (cursor) query.cursor = cursor;

      const response = await MiroClient.getApi().getAllCases(limit, orgId, query);

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving cases: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default getAllCasesTool;