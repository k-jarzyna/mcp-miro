import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getCaseTool: ToolSchema = {
  name: "get-case",
  description: "Retrieves information about a specific eDiscovery case (Enterprise only)",
  args: {
    orgId: z.string().describe("The ID of the organization for which you want to retrieve the case information"),
    caseId: z.string().describe("The ID of the case you want to retrieve")
  },
  fn: async ({ orgId, caseId }) => {
    try {
      const response = await MiroClient.getApi().getCase(orgId, caseId);

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving case: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default getCaseTool;