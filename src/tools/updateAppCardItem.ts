import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

import { AppCardUpdateRequest } from '@mirohq/miro-api/dist/model/appCardUpdateRequest.js';
import { AppCardDataChanges } from '@mirohq/miro-api/dist/model/appCardDataChanges.js';
import { CustomField } from '@mirohq/miro-api/dist/model/customField.js';

const updateAppCardItemTool: ToolSchema = {
  name: "update-app-card-item",
  description: "Update an existing app card item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the app card"),
    itemId: z.string().describe("Unique identifier (ID) of the app card that you want to update"),
    data: z.object({
      title: z.string().optional().nullish().describe("Updated title of the app card"),
      description: z.string().optional().nullish().describe("Updated description of the app card"),
      status: z.string().optional().nullish().describe("Updated status text of the app card"),
      fields: z.array(z.object({
        value: z.string().describe("Value of the field"),
        iconShape: z.string().optional().nullish().describe("Shape of the icon"),
        fillColor: z.string().optional().nullish().describe("Fill color of the field"),
        textColor: z.string().optional().nullish().describe("Color of the text"),
      })).optional().nullish().describe("Updated custom fields to display on the app card")
    }).optional().nullish().describe("The updated content and configuration of the app card"),
    position: z.object({
      x: z.number().describe("Updated X coordinate of the app card"),
      y: z.number().describe("Updated Y coordinate of the app card")
    }).optional().nullish().describe("Updated position of the app card on the board"),
    geometry: z.object({
      width: z.number().optional().nullish().describe("Updated width of the app card"),
      height: z.number().optional().nullish().describe("Updated height of the app card")
    }).optional().nullish().describe("Updated dimensions of the app card")
  },
  fn: async ({ boardId, itemId, data, position, geometry }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      const updateRequest = new AppCardUpdateRequest();
      
      if (data) {
        const appCardData = new AppCardDataChanges();
        
        if (data.title !== undefined) appCardData.title = data.title;
        if (data.description !== undefined) appCardData.description = data.description;
        if (data.status !== undefined) appCardData.status = data.status;
        
        if (data.fields) {
          appCardData.fields = data.fields.map(field => {
            const customField = new CustomField();
            customField.value = field.value;
            if (field.iconShape) customField.iconShape = field.iconShape;
            if (field.fillColor) customField.fillColor = field.fillColor;
            if (field.textColor) customField.textColor = field.textColor;
            return customField;
          });
        }
        
        updateRequest.data = appCardData;
      }
      
      if (position) {
        updateRequest.position = position;
      }
      
      if (geometry) {
        updateRequest.geometry = geometry;
      }

      const result = await MiroClient.getApi().updateAppCardItem(boardId, itemId, updateRequest);
      
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default updateAppCardItemTool;