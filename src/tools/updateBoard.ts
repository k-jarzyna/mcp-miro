import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const updateBoardTool: ToolSchema = {
  name: "update-board",
  description: "Update an existing Miro board with new settings",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that you want to update"),
    name: z.string().optional().nullable().describe("New name for the board"),
    description: z.string().optional().nullable().describe("New description for the board"),
    sharingPolicy: z.enum(['private', 'view', 'comment', 'edit']).optional().nullable().describe("New sharing policy for the board"),
    teamId: z.string().optional().nullable().describe("New team ID to assign the board to")
  },
  fn: async ({ boardId, name, description, sharingPolicy, teamId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      const boardChanges = {};
      if (name) boardChanges['name'] = name;
      if (description !== undefined) boardChanges['description'] = description;
      if (sharingPolicy) boardChanges['sharingPolicy'] = { access: sharingPolicy };
      if (teamId) boardChanges['teamId'] = teamId;

      const boardData = await MiroClient.getApi().updateBoard(boardId, boardChanges);

      return ServerResponse.text(JSON.stringify(boardData, null, 2));
    } catch (error) {
      process.stderr.write(`Error updating Miro board: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
}

export default updateBoardTool;