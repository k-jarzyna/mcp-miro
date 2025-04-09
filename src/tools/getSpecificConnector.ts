import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const getSpecificConnectorTool: ToolSchema = {
  name: "get-specific-connector",
  description: "Retrieve information about a specific connector on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the connector"),
    connectorId: z.string().describe("Unique identifier (ID) of the connector that you want to retrieve")
  },
  fn: async ({ boardId, connectorId }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!connectorId) {
        return ServerResponse.error("Connector ID is required");
      }

      const connectorData = await MiroClient.getApi().getConnector(boardId, connectorId);
      return ServerResponse.text(JSON.stringify(connectorData, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default getSpecificConnectorTool;