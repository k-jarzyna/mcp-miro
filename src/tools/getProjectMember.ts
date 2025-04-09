import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getProjectMemberTool: ToolSchema = {
  name: "get-project-member",
  description: "Retrieves information about a specific project member (Enterprise only)",
  args: {
    orgId: z.string().describe("The ID of the organization to which the project belongs"),
    teamId: z.string().describe("The ID of the team to which the project belongs"),
    projectId: z.string().describe("The ID of the project from which you want to retrieve specific member information"),
    memberId: z.string().describe("The ID of the member for which you want to retrieve information")
  },
  fn: async ({ orgId, teamId, projectId, memberId }) => {
    try {
      const response = await MiroClient.getApi().enterpriseGetProjectMember(
        orgId,
        teamId,
        projectId,
        memberId
      );

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving project member: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default getProjectMemberTool;