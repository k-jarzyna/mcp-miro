import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

import { CardCreateRequest } from '@mirohq/miro-api/dist/model/cardCreateRequest.js';
import { CardData } from '@mirohq/miro-api/dist/model/cardData.js';

const createCardItemTool: ToolSchema = {
  name: "create-card-item",
  description: "Create a new card item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board where the card will be created"),
    data: z.object({
      title: z.string().describe("Title of the card"),
      description: z.string().optional().describe("Description of the card"),
      assigneeId: z.string().optional().describe("User ID of the assignee"),
      dueDate: z.string().optional().describe("Due date for the card (ISO 8601 format)")
    }).describe("The content and configuration of the card"),
    position: z.object({
      x: z.number().describe("X coordinate of the card"),
      y: z.number().describe("Y coordinate of the card")
    }).describe("Position of the card on the board"),
    geometry: z.object({
      width: z.number().optional().describe("Width of the card"),
      height: z.number().optional().describe("Height of the card"),
      rotation: z.number().optional().describe("Rotation angle of the card")
    }).optional().describe("Dimensions of the card"),
    style: z.object({
      cardTheme: z.string().optional().describe("Color of the card")
    }).optional().describe("Style configuration of the card")
  },
  fn: async ({ boardId, data, position, geometry, style }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      const createRequest = new CardCreateRequest();
      
      const cardData = new CardData();
      cardData.title = data.title;
      
      if (data.description !== undefined) cardData.description = data.description;
      if (data.assigneeId !== undefined) cardData.assigneeId = data.assigneeId;
      
      if (data.dueDate !== undefined) {
        cardData.dueDate = new Date(data.dueDate);
      }
      
      createRequest.data = cardData;
      createRequest.position = position;
      
      if (geometry) {
        createRequest.geometry = geometry;
      }
      
      if (style) {
        createRequest.style = style;
      }

      const result = await MiroClient.getApi().createCardItem(boardId, createRequest);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default createCardItemTool;