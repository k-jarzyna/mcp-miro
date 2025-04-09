import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const createBoardExportJobTool: ToolSchema = {
  name: "create-board-export-job",
  description: "Creates an export job for one or more boards (Enterprise only)",
  args: {
    orgId: z.string().describe("Unique identifier of the organization"),
    requestId: z.string().describe("Unique identifier of the board export job"),
    boardIds: z.array(z.string()).describe("Array of board IDs to export"),
    format: z.enum(["pdf", "csv"]).optional().describe("Export format (default: pdf)")
  },
  fn: async ({ orgId, requestId, boardIds, format }) => {
    try {
      const createBoardExportRequest = {
        boardIds: boardIds,
        ...(format && { format: format })
      };

      const response = await MiroClient.getApi().enterpriseCreateBoardExport(
        orgId,
        requestId,
        createBoardExportRequest
      );

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error creating board export job: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default createBoardExportJobTool;