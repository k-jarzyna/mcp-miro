import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

import { ConnectorChangesData } from '@mirohq/miro-api/dist/model/connectorChangesData.js';

const updateConnectorTool: ToolSchema = {
  name: "update-connector",
  description: "Update an existing connector on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the connector"),
    connectorId: z.string().describe("Unique identifier (ID) of the connector that you want to update"),
    startItem: z.object({
      id: z.string().describe("ID of the item at the start of the connector")
    }).optional().describe("Start item of the connector"),
    endItem: z.object({
      id: z.string().describe("ID of the item at the end of the connector")
    }).optional().describe("End item of the connector"),
    style: z.object({
      strokeColor: z.string().optional().describe("Updated color of the connector stroke"),
      strokeWidth: z.number().optional().describe("Updated width of the connector stroke"),
      strokeStyle: z.string().optional().describe("Updated style of the connector stroke (normal, dashed, etc.)"),
      startStrokeCap: z.string().optional().describe("Updated start stroke cap style"),
      endStrokeCap: z.string().optional().describe("Updated end stroke cap style")
    }).optional().describe("Updated style configuration of the connector")
  },
  fn: async ({ boardId, connectorId, startItem, endItem, style }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!connectorId) {
        return ServerResponse.error("Connector ID is required");
      }

      const changes = new ConnectorChangesData();
      
      if (startItem) {
        changes.startItem = startItem;
      }
      
      if (endItem) {
        changes.endItem = endItem;
      }
      
      if (style) {
        changes.style = style;
      }

      const result = await MiroClient.getApi().updateConnector(boardId, connectorId, changes);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default updateConnectorTool;