import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getLegalHoldContentItemsTool: ToolSchema = {
  name: "get-legal-hold-content-items",
  description: "Retrieves the list of content items under legal hold (Enterprise only)",
  args: {
    orgId: z.string().describe("The ID of the organization for which you want to retrieve the list of content items under hold"),
    caseId: z.string().describe("The ID of the case for which you want to retrieve the list of content items under hold"),
    legalHoldId: z.string().describe("The ID of the legal hold for which you want to retrieve the list of content items under hold"),
    limit: z.number().describe("The maximum number of items in the result list"),
    cursor: z.string().optional().nullish().describe("Cursor for pagination")
  },
  fn: async ({ orgId, caseId, legalHoldId, limit, cursor }) => {
    try {
      const query: any = {};
      if (cursor) query.cursor = cursor;

      const response = await MiroClient.getApi().getLegalHoldContentItems(
        orgId,
        caseId,
        legalHoldId,
        limit,
        query
      );

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving legal hold content items: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default getLegalHoldContentItemsTool;