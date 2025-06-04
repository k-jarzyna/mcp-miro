import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

import { ConnectorCreationData } from '@mirohq/miro-api/dist/model/connectorCreationData.js';

const createConnectorTool: ToolSchema = {
  name: "create-connector",
  description: "Create a new connector between items on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board where the connector will be created"),
    startItem: z.object({
      id: z.string().describe("ID of the item at the start of the connector")
    }).describe("Start item of the connector"),
    endItem: z.object({
      id: z.string().describe("ID of the item at the end of the connector") 
    }).describe("End item of the connector"),
    style: z.object({
      strokeColor: z.string().optional().nullable().describe("Color of the connector stroke"),
      strokeWidth: z.number().optional().nullable().describe("Width of the connector stroke"),
      strokeStyle: z.string().optional().nullable().describe("Style of the connector stroke (normal, dashed, etc.)"),
      startStrokeCap: z.string().optional().nullable().describe("Start stroke cap style"),
      endStrokeCap: z.string().optional().nullable().describe("End stroke cap style")
    }).optional().nullable().describe("Style configuration of the connector")
  },
  fn: async ({ boardId, startItem, endItem, style }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      const connectorData = new ConnectorCreationData();
      connectorData.startItem = startItem;
      connectorData.endItem = endItem;
      
      if (style) {
        connectorData.style = style;
      }

      const result = await MiroClient.getApi().createConnector(boardId, connectorData);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default createConnectorTool;