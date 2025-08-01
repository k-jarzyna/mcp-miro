import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

import { ImageCreateRequest } from '@mirohq/miro-api/dist/model/imageCreateRequest.js';
import { ImageUrlData } from '@mirohq/miro-api/dist/model/imageUrlData.js';

const createImageItemUsingUrlTool: ToolSchema = {
  name: "create-image-item-using-url",
  description: "Create a new image item on a Miro board using a URL",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board where the image will be created"),
    data: z.object({
      url: z.string().describe("URL of the image to be added to the board"),
      title: z.string().optional().nullish().describe("Title of the image")
    }).describe("The content and configuration of the image"),
    position: z.object({
      x: z.number().describe("X coordinate of the image"),
      y: z.number().describe("Y coordinate of the image"),
      origin: z.string().optional().nullish().describe("Origin of the image (center, top-left, etc.)"),
      relativeTo: z.string().optional().nullish().describe("Reference point (canvas_center, etc.)")
    }).describe("Position of the image on the board"),
    geometry: z.object({
      width: z.number().optional().nullish().describe("Width of the image"),
      height: z.number().optional().nullish().describe("Height of the image")
    }).optional().nullish().describe("Dimensions of the image")
  },
  fn: async ({ boardId, data, position, geometry }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      const createRequest = new ImageCreateRequest();
      
      const imageData = new ImageUrlData();
      imageData.url = data.url;
      
      if (data.title !== undefined) {
        imageData.title = data.title;
      }
      
      createRequest.data = imageData;
      
      const completePosition = {
        ...position,
        origin: position.origin || "center",
        relativeTo: position.relativeTo || "canvas_center"
      };
      
      createRequest.position = completePosition;
      
      if (geometry) {
        createRequest.geometry = geometry;
      }

      const result = await MiroClient.getApi().createImageItemUsingUrl(boardId, createRequest);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default createImageItemUsingUrlTool;