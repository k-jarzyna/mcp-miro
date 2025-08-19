import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const shareBoardTool: ToolSchema = {
  name: "share-board",
  description: "Share a Miro board with specific access level and optional team assignment",
  args: {
    boardId: z.string().describe("ID of the board to share"),
    accessLevel: z.enum(['private', 'view', 'comment', 'edit']).describe("Access level for shared board"),
    teamId: z.string().optional().nullish().describe("Team ID to assign the board to"),
  },
  fn: async ({ boardId, accessLevel, teamId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      const boardChanges = {
        sharingPolicy: {
          access: accessLevel
        },
        teamId
      };

      const result = await MiroClient.getApi().updateBoard(boardId, boardChanges);

      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      process.stderr.write(`Error sharing Miro board: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
}

export default shareBoardTool;