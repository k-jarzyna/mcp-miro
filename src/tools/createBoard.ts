import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const createBoardTool: ToolSchema = {
  name: "create-board",
  description: "Create a new Miro board with specified name and sharing policies",
  args: {
    name: z.string().describe("Name of the board to create"),
    description: z.string().optional().nullish().describe("Description of the board"),
    sharingPolicy: z.enum(['private', 'view', 'comment', 'edit']).optional().nullish().describe("Sharing policy for the board"),
    teamId: z.string().optional().nullish().describe("Team ID to assign the board to")
  },
  fn: async ({ name, description, sharingPolicy, teamId }) => {
    try {
      if (!name) {
        return ServerResponse.error("Board name is required");
      }

      const boardChanges = {
        name,
        description,
        sharingPolicy: {
          access: sharingPolicy || 'private'
        },
        teamId
      };

      const boardData = await MiroClient.getApi().createBoard(boardChanges);

      return ServerResponse.text(JSON.stringify(boardData, null, 2));
    } catch (error) {
      process.stderr.write(`Error creating Miro board: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
}

export default createBoardTool;