import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const removeProjectMemberTool: ToolSchema = {
  name: "remove-project-member",
  description: "Removes a member from a project (Enterprise only)",
  args: {
    orgId: z.string().describe("The ID of the organization to which the project belongs"),
    teamId: z.string().describe("The ID of the team to which the project belongs"),
    projectId: z.string().describe("The ID of the project from which you want to remove a member"),
    memberId: z.string().describe("The ID of the member that you want to remove from a project")
  },
  fn: async ({ orgId, teamId, projectId, memberId }) => {
    try {
      const response = await MiroClient.getApi().enterpriseDeleteProjectMember(
        orgId,
        teamId,
        projectId,
        memberId
      );

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error removing project member: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default removeProjectMemberTool;