import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';
import { DocumentUpdateRequest } from '@mirohq/miro-api/dist/model/documentUpdateRequest.js';
import { DocumentUrlData } from '@mirohq/miro-api/dist/model/documentUrlData.js';

const updateDocumentItemTool: ToolSchema = {
  name: "update-document-item",
  description: "Update an existing document item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the document"),
    itemId: z.string().describe("Unique identifier (ID) of the document that you want to update"),
    data: z.object({
      url: z.string().optional().describe("Updated URL of the document"),
      title: z.string().optional().describe("Updated title of the document")
    }).optional().describe("The updated content and configuration of the document"),
    position: z.object({
      x: z.number().optional().describe("Updated X coordinate of the document"),
      y: z.number().optional().describe("Updated Y coordinate of the document")
    }).optional().describe("Updated position of the document on the board"),
    geometry: z.object({
      width: z.number().optional().describe("Updated width of the document"),
      height: z.number().optional().describe("Updated height of the document")
    }).optional().describe("Updated dimensions of the document")
  },
  fn: async ({ boardId, itemId, data, position, geometry }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }
      
      const updateRequest = new DocumentUpdateRequest();
      
      if (data) {
        const documentData = new DocumentUrlData();
        
        if (data.url !== undefined) documentData.url = data.url;
        if (data.title !== undefined) documentData.title = data.title;
        
        if (Object.keys(documentData).length > 0) {
          updateRequest.data = documentData;
        }
      }
      
      if (position) {
        updateRequest.position = position;
      }
      
      if (geometry) {
        updateRequest.geometry = geometry;
      }
      
      if (Object.keys(updateRequest).length === 0) {
        return ServerResponse.error("No data provided for update");
      }

      const result = await MiroClient.getApi().updateDocumentItemUsingUrl(boardId, itemId, updateRequest);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default updateDocumentItemTool;