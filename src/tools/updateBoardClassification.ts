import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const updateBoardClassificationTool: ToolSchema = {
  name: "update-board-classification",
  description: "Updates board classification for an existing board (Enterprise only)",
  args: {
    orgId: z.string().describe("id of the organization"),
    teamId: z.string().describe("id of the team"),
    boardId: z.string().describe("Unique identifier of the board that you want to update"),
    labelId: z.string().describe("Unique identifier of the classification label to apply")
  },
  fn: async ({ orgId, teamId, boardId, labelId }) => {
    try {
      const dataClassificationLabelId = {
        labelId: labelId
      };

      const response = await MiroClient.getApi().enterpriseDataclassificationBoardSet(
        orgId, 
        teamId, 
        boardId, 
        dataClassificationLabelId
      );

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error updating board classification: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default updateBoardClassificationTool;