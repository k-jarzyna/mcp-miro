import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getBoardClassificationTool: ToolSchema = {
  name: "get-board-classification",
  description: "Retrieves board classification for a board (Enterprise only)",
  args: {
    orgId: z.string().describe("id of the organization"),
    teamId: z.string().describe("id of the team"),
    boardId: z.string().describe("Unique identifier of the board that you want to retrieve"),
  },
  fn: async ({ orgId, teamId, boardId }) => {
    try {
      const response = await MiroClient.getApi().enterpriseDataclassificationBoardGet(orgId, teamId, boardId);

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving board classification: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default getBoardClassificationTool;