import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const addProjectMemberTool: ToolSchema = {
  name: "add-project-member",
  description: "Adds a member to a project (Enterprise only)",
  args: {
    orgId: z.string().describe("The ID of the organization to which the project belongs"),
    teamId: z.string().describe("The ID of the team to which the project belongs"),
    projectId: z.string().describe("The ID of the project to which you want to add a user"),
    email: z.string().describe("Email ID of the user to add to the project"),
    role: z.enum(["owner", "editor", "commenter", "viewer"]).describe("Role to assign to the user")
  },
  fn: async ({ orgId, teamId, projectId, email, role }) => {
    try {
      const addProjectMemberRequest = {
        email,
        role
      };

      const response = await MiroClient.getApi().enterpriseAddProjectMember(
        orgId,
        teamId,
        projectId,
        addProjectMemberRequest
      );

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error adding project member: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default addProjectMemberTool;