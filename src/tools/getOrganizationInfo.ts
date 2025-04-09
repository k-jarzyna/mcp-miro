import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getOrganizationInfoTool: ToolSchema = {
  name: "get-organization-info",
  description: "Retrieves organization information (Enterprise only)",
  args: {
    orgId: z.string().describe("id of the organization")
  },
  fn: async ({ orgId }) => {
    try {
      const response = await MiroClient.getApi().enterpriseGetOrganization(orgId);

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving organization info: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default getOrganizationInfoTool;