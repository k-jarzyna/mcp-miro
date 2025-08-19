import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

import { EmbedCreateRequest } from '@mirohq/miro-api/dist/model/embedCreateRequest.js';
import { EmbedUrlData } from '@mirohq/miro-api/dist/model/embedUrlData.js';

const createEmbedItemTool: ToolSchema = {
  name: "create-embed-item",
  description: "Create a new embed item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board where the embed will be created"),
    data: z.object({
      url: z.string().describe("URL to be embedded on the board"),
      mode: z.string().optional().nullish().describe("Mode of the embed (normal, inline, etc.)")
    }).describe("The content and configuration of the embed"),
    position: z.object({
      x: z.number().describe("X coordinate of the embed"),
      y: z.number().describe("Y coordinate of the embed"),
      origin: z.string().optional().nullish().describe("Origin of the embed (center, top-left, etc.)"),
      relativeTo: z.string().optional().nullish().describe("Reference point (canvas_center, etc.)")
    }).describe("Position of the embed on the board"),
    geometry: z.object({
      width: z.number().optional().nullish().describe("Width of the embed"),
      height: z.number().optional().nullish().describe("Height of the embed")
    })
    .refine(data => data.width !== undefined || data.height !== undefined, {
      message: "Either width or height must be provided"
    })
    .refine(data => !(data.width !== undefined && data.height !== undefined), {
      message: "Only one of width or height should be provided for items with fixed aspect ratio"
    })
    .describe("Dimensions of the embed")
  },
  fn: async ({ boardId, data, position, geometry }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      const createRequest = new EmbedCreateRequest();
      
      const embedData = new EmbedUrlData();
      embedData.url = data.url;
      
      if (data.mode !== undefined) {
        embedData.mode = data.mode;
      }
      
      createRequest.data = embedData;
      
      const completePosition = {
        ...position,
        origin: position.origin || "center",
        relativeTo: position.relativeTo || "canvas_center"
      };
      
      createRequest.position = completePosition;
      createRequest.geometry = geometry;

      const result = await MiroClient.getApi().createEmbedItem(boardId, createRequest);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default createEmbedItemTool;