import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const listBoardsTool: ToolSchema = {
  name: "list-boards",
  description: "List all available Miro boards",
  args: {
    limit: z.number().optional().nullish().describe("Maximum number of boards to return (default: 50)"),
    offset: z.number().optional().nullish().describe("Offset for pagination (default: 0)")
  },
  fn: async ({ limit = 50, offset = 0 }) => {
    try {

      const boardsData = await MiroClient.getApi().getBoards();

      return ServerResponse.text(JSON.stringify(boardsData, null, 2))
    } catch (error) {
      process.stderr.write(`Error fetching Miro boards: ${error}\n`);

      return ServerResponse.error(error)
    }
  }
}

export default listBoardsTool;