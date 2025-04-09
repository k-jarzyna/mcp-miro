import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const deleteConnectorTool: ToolSchema = {
  name: "delete-connector",
  description: "Delete a specific connector from a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the connector"),
    connectorId: z.string().describe("Unique identifier (ID) of the connector that you want to delete")
  },
  fn: async ({ boardId, connectorId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!connectorId) {
        return ServerResponse.error("Connector ID is required");
      }

      await MiroClient.getApi().deleteConnector(boardId, connectorId);
      return ServerResponse.text(JSON.stringify({ success: true, message: "Connector deleted successfully" }, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default deleteConnectorTool;