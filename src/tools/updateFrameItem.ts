import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

import { FrameUpdateRequest } from '@mirohq/miro-api/dist/model/frameUpdateRequest.js';
import { FrameChanges } from '@mirohq/miro-api/dist/model/frameChanges.js';

const updateFrameItemTool: ToolSchema = {
  name: "update-frame-item",
  description: "Update a frame on a Miro board based on the data, style, or geometry properties provided in the request body",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board where you want to update the frame"),
    itemId: z.string().describe("Unique identifier (ID) of the frame that you want to update"),
    data: z.object({
      title: z.string().optional().nullish().describe("Title of the frame. This title appears at the top of the frame."),
      format: z.string().optional().nullish().describe("Format of the frame. Only 'custom' is supported currently."),
      type: z.string().optional().nullish().describe("Type of the frame. Only 'freeform' is supported currently."),
      showContent: z.boolean().optional().nullish().describe("Hide or reveal the content inside a frame (Enterprise plan only).")
    }).optional().nullish().describe("The updated content and configuration of the frame"),
    position: z.object({
      x: z.number().describe("X coordinate of the frame"),
      y: z.number().describe("Y coordinate of the frame")
    }).optional().nullish().describe("Updated position of the frame on the board"),
    geometry: z.object({
      width: z.number().optional().nullish().describe("Width of the frame"),
      height: z.number().optional().nullish().describe("Height of the frame")
    }).optional().nullish().describe("Updated dimensions of the frame"),
    style: z.object({
      fillColor: z.string().optional().nullish().describe("Fill color for the frame. Hex values like #f5f6f8, #d5f692, etc.")
    }).optional().nullish().describe("Updated style configuration of the frame")
  },
  fn: async ({ boardId, itemId, data, position, geometry, style }: {
    boardId: string,
    itemId: string,
    data?: {
      title?: string,
      format?: string,
      type?: string,
      showContent?: boolean
    },
    position?: {
      x: number,
      y: number
    },
    geometry?: {
      width?: number,
      height?: number
    },
    style?: {
      fillColor?: string
    }
  }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      const updateRequest = new FrameUpdateRequest();
      
      if (data) {
        const frameData = new FrameChanges();
        
        if (data.title !== undefined) frameData.title = data.title;
        if (data.format !== undefined) frameData.format = data.format;
        if (data.type !== undefined) frameData.type = data.type;
        if (data.showContent !== undefined) frameData.showContent = data.showContent;
        
        updateRequest.data = frameData;
      }
      
      if (position) {
        updateRequest.position = position;
      }
      
      if (geometry) {
        updateRequest.geometry = geometry;
      }
      
      if (style) {
        updateRequest.style = style;
      }

      const result = await MiroClient.getApi().updateFrameItem(boardId, itemId, updateRequest);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default updateFrameItemTool;