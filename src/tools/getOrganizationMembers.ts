import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getOrganizationMembersTool: ToolSchema = {
  name: "get-organization-members",
  description: "Retrieves a list of members for an organization (Enterprise only)",
  args: {
    orgId: z.string().describe("id of the organization"),
    emails: z.string().optional().nullish().describe("Filter by comma-separated email addresses"),
    role: z.enum(['organization_internal_admin', 'organization_internal_user', 'organization_external_user', 'organization_team_guest_user', 'unknown']).optional().nullish().describe("Filter by user role"),
    license: z.enum(['full', 'occasional', 'free', 'free_restricted', 'full_trial', 'unknown']).optional().nullish().describe("Filter by license type"),
    active: z.boolean().optional().nullish().describe("Filter by active status"),
    cursor: z.string().optional().nullish().describe("Cursor for pagination"),
    limit: z.number().optional().nullish().describe("Maximum number of results to return")
  },
  fn: async ({ orgId, emails, role, license, active, cursor, limit }) => {
    try {
      const query: any = {};
      if (emails) query.emails = emails;
      if (role) query.role = role;
      if (license) query.license = license;
      if (active !== undefined) query.active = active;
      if (cursor) query.cursor = cursor;
      if (limit) query.limit = limit;

      const response = await MiroClient.getApi().enterpriseGetOrganizationMembers(orgId, query);

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving organization members: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default getOrganizationMembersTool;