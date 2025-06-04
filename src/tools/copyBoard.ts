import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const copyBoardTool: ToolSchema = {
  name: "copy-board",
  description: "Create a copy of an existing Miro board with optional new settings",
  args: {
    copyFrom: z.string().describe("Unique identifier (ID) of the board that you want to copy"),
    name: z.string().optional().nullable().describe("Name for the new copied board"),
    description: z.string().optional().nullable().describe("Description for the new copied board"),
    sharingPolicy: z.enum(['private', 'view', 'comment', 'edit']).optional().nullable().describe("Sharing policy for the new copied board"),
    teamId: z.string().optional().nullable().describe("Team ID to assign the new copied board to")
  },
  fn: async ({ copyFrom, name, description, sharingPolicy, teamId }) => {
    try {
      if (!copyFrom) {
        return ServerResponse.error("Source board ID is required");
      }

      const copyBoardChanges = {};
      if (name) copyBoardChanges['name'] = name;
      if (description !== undefined) copyBoardChanges['description'] = description;
      if (sharingPolicy) copyBoardChanges['sharingPolicy'] = { access: sharingPolicy };
      if (teamId) copyBoardChanges['teamId'] = teamId;

      const boardData = await MiroClient.getApi().copyBoard(copyFrom, copyBoardChanges);

      return ServerResponse.text(JSON.stringify(boardData, null, 2));
    } catch (error) {
      process.stderr.write(`Error copying Miro board: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
}

export default copyBoardTool;