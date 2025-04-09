import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getOrganizationMemberTool: ToolSchema = {
  name: "get-organization-member",
  description: "Retrieves information about a specific organization member (Enterprise only)",
  args: {
    orgId: z.string().describe("id of the organization"),
    memberId: z.string().describe("id of the organization member")
  },
  fn: async ({ orgId, memberId }) => {
    try {
      const response = await MiroClient.getApi().enterpriseGetOrganizationMember(orgId, memberId);

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving organization member: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default getOrganizationMemberTool;