import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getBoardExportJobResultsTool: ToolSchema = {
  name: "get-board-export-job-results",
  description: "Retrieves the results of a board export job (Enterprise only)",
  args: {
    orgId: z.string().describe("Unique identifier of the organization"),
    jobId: z.string().describe("Unique identifier of the job")
  },
  fn: async ({ orgId, jobId }) => {
    try {
      const response = await MiroClient.getApi().enterpriseBoardExportJobResults(orgId, jobId);

      return ServerResponse.text(JSON.stringify(response.body, null, 2));
    } catch (error) {
      process.stderr.write(`Error retrieving board export job results: ${error}\n`);
      return ServerResponse.error(error);
    }
  }
};

export default getBoardExportJobResultsTool;