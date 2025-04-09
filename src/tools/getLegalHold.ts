import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getLegalHoldTool: ToolSchema = {
  name: "get-legal-hold",
  description: "Retrieves information about a specific legal hold (Enterprise only)",
  args: {
    orgId: z.string().describe("The ID of the organization for which you want to retrieve the legal hold information"),
    caseId: z.string().describe("The ID of the case for which you want to retrieve the legal hold information"),
    legalHoldId: z.string().describe("The ID of the legal hold you want to retrieve")
  },
  fn: async ({ orgId, caseId, legalHoldId }) => {
    try {
      const response = await MiroClient.getApi().getLegalHold(orgId, caseId, legalHoldId);

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving legal hold: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default getLegalHoldTool;