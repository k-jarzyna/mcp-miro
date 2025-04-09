import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

import { DocumentCreateRequest } from '@mirohq/miro-api/dist/model/documentCreateRequest.js';
import { DocumentUrlData } from '@mirohq/miro-api/dist/model/documentUrlData.js';

const createDocumentItemTool: ToolSchema = {
  name: "create-document-item",
  description: "Create a new document item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board where the document will be created"),
    data: z.object({
      url: z.string().describe("URL of the document to be added to the board"),
      title: z.string().optional().describe("Title of the document")
    }).describe("The content and configuration of the document"),
    position: z.object({
      x: z.number().describe("X coordinate of the document"),
      y: z.number().describe("Y coordinate of the document")
    }).describe("Position of the document on the board"),
    geometry: z.object({
      width: z.number().optional().describe("Width of the document"),
      height: z.number().optional().describe("Height of the document")
    }).optional().describe("Dimensions of the document")
  },
  fn: async ({ boardId, data, position, geometry }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      const createRequest = new DocumentCreateRequest();
      
      const documentData = new DocumentUrlData();
      documentData.url = data.url;
      
      if (data.title !== undefined) documentData.title = data.title;
      
      createRequest.data = documentData;
      createRequest.position = position;
      
      if (geometry) {
        createRequest.geometry = geometry;
      }

      const result = await MiroClient.getApi().createDocumentItemUsingUrl(boardId, createRequest);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default createDocumentItemTool;