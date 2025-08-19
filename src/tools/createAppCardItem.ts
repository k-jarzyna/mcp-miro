import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { AppCardCreateRequest } from '@mirohq/miro-api/dist/model/appCardCreateRequest.js';
import { AppCardDataChanges } from '@mirohq/miro-api/dist/model/appCardDataChanges.js';
import { CustomField } from '@mirohq/miro-api/dist/model/customField.js';
import { ToolSchema } from '../tool.js';

const createAppCardItemTool: ToolSchema = {
  name: "create-app-card-item",
  description: "Create a new app card item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board where the app card will be created"),
    data: z.object({
      title: z.string().describe("Title of the app card"),
      description: z.string().optional().nullish().describe("Description of the app card"),
      status: z.string().optional().nullish().describe("Status text of the app card"),
      fields: z.array(z.object({
        value: z.string().describe("Value of the field"),
        iconShape: z.string().optional().nullish().describe("Shape of the icon"),
        fillColor: z.string().optional().nullish().describe("Fill color of the field"),
        textColor: z.string().optional().nullish().describe("Color of the text"),
      })).optional().nullish().describe("Custom fields to display on the app card")
    }).describe("The content and configuration of the app card"),
    position: z.object({
      x: z.number().describe("X coordinate of the app card"),
      y: z.number().describe("Y coordinate of the app card")
    }).describe("Position of the app card on the board"),
    geometry: z.object({
      width: z.number().optional().nullish().describe("Width of the app card"),
      height: z.number().optional().nullish().describe("Height of the app card")
    }).optional().nullish().describe("Dimensions of the app card")
  },
  fn: async ({boardId, data, position, geometry}) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      const createRequest = new AppCardCreateRequest();

      const appCardData = new AppCardDataChanges();
      appCardData.title = data.title;

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

      createRequest.data = appCardData;
      createRequest.position = position;

      if (geometry) {
        createRequest.geometry = geometry;
      }

      const result = await MiroClient.getApi().createAppCardItem(boardId, createRequest);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default createAppCardItemTool;
