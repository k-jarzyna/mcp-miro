import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

import { ImageUpdateRequest } from '@mirohq/miro-api/dist/model/imageUpdateRequest.js';

const updateImageItemTool: ToolSchema = {
  name: "update-image-item",
  description: "Update an existing image item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board where you want to update the item"),
    itemId: z.string().describe("Unique identifier (ID) of the image that you want to update"),
    data: z.object({
      title: z.string().optional().nullish().describe("Updated title of the image")
    }).optional().nullish().describe("The updated content of the image"),
    position: z.object({
      x: z.number().optional().nullish().describe("Updated X coordinate of the image"),
      y: z.number().optional().nullish().describe("Updated Y coordinate of the image"),
      origin: z.string().optional().nullish().describe("Updated origin of the image (center, top-left, etc.)"),
      relativeTo: z.string().optional().nullish().describe("Updated reference point (canvas_center, etc.)")
    }).optional().nullish().describe("Updated position of the image on the board"),
    geometry: z.object({
      width: z.number().optional().nullish().describe("Updated width of the image"),
      height: z.number().optional().nullish().describe("Updated height of the image")
    }).optional().nullish().describe("Updated dimensions of the image")
  },
  fn: async ({ boardId, itemId, data, position, geometry }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      const updateRequest = new ImageUpdateRequest();
      
      if (data) {
        updateRequest.data = {};
        
        if (data.title !== undefined) {
          updateRequest.data.title = data.title;
        }
      }
      
      if (position) {
        updateRequest.position = position;
      }
      
      if (geometry) {
        updateRequest.geometry = geometry;
      }

      const result = await MiroClient.getApi().updateImageItemUsingUrl(boardId, itemId, updateRequest);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default updateImageItemTool;