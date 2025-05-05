import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

import { CardUpdateRequest } from '@mirohq/miro-api/dist/model/cardUpdateRequest.js';
import { CardData } from '@mirohq/miro-api/dist/model/cardData.js';

const updateCardItemTool: ToolSchema = {
  name: "update-card-item",
  description: "Update an existing card item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the card"),
    itemId: z.string().describe("Unique identifier (ID) of the card that you want to update"),
    data: z.object({
      title: z.string().optional().describe("Updated title of the card"),
      description: z.string().optional().describe("Updated description of the card"),
      assigneeId: z.string().optional().describe("Updated user ID of the assignee"),
      dueDate: z.string().optional().describe("Updated due date for the card (ISO 8601 format)")
    }).optional().describe("The updated content and configuration of the card"),
    position: z.object({
      x: z.number().describe("Updated X coordinate of the card"),
      y: z.number().describe("Updated Y coordinate of the card")
    }).optional().describe("Updated position of the card on the board"),
    geometry: z.object({
      width: z.number().optional().describe("Updated width of the card"),
      height: z.number().optional().describe("Updated height of the card"),
      rotation: z.number().optional().describe("Updated rotation angle of the card")
    }).optional().describe("Updated dimensions of the card"),
    style: z.object({
      cardTheme: z.string().optional().describe("Updated color of the card")
    }).optional().describe("Updated style configuration of the card")
  },
  fn: async ({ boardId, itemId, data, position, geometry, style }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      const updateData = new CardUpdateRequest();
      
      if (data) {
        const cardData = new CardData();
        
        if (data.title !== undefined) cardData.title = data.title;
        if (data.description !== undefined) cardData.description = data.description;
        if (data.assigneeId !== undefined) cardData.assigneeId = data.assigneeId;
        
        if (data.dueDate !== undefined) {
          cardData.dueDate = new Date(data.dueDate);
        }
        
        updateData.data = cardData;
      }
      
      if (position) {
        updateData.position = position;
      }
      
      if (geometry) {
        updateData.geometry = geometry;
      }
      
      if (style) {
        updateData.style = style;
      }

      const result = await MiroClient.getApi().updateCardItem(boardId, itemId, updateData);
      
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default updateCardItemTool;