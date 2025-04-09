import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getBoardExportJobStatusTool: ToolSchema = {
  name: "get-board-export-job-status",
  description: "Retrieves the status of a board export job (Enterprise only)",
  args: {
    orgId: z.string().describe("Unique identifier of the organization"),
    jobId: z.string().describe("Unique identifier of the board export job")
  },
  fn: async ({ orgId, jobId }) => {
    try {
      const response = await MiroClient.getApi().enterpriseBoardExportJobStatus(orgId, jobId);

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving board export job status: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default getBoardExportJobStatusTool;