import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

import { FrameCreateRequest } from '@mirohq/miro-api/dist/model/frameCreateRequest.js';
import { FrameChanges } from '@mirohq/miro-api/dist/model/frameChanges.js';

const createFrameItemTool: ToolSchema = {
  name: "create-frame",
  description: "Create a new frame on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board where the frame will be created"),
    data: z.object({
      title: z.string().optional().describe("Title of the frame. This title appears at the top of the frame."),
      format: z.string().optional().describe("Format of the frame. Only 'custom' is supported currently."),
      type: z.string().optional().describe("Type of the frame. Only 'freeform' is supported currently."),
      showContent: z.boolean().optional().describe("Hide or reveal the content inside a frame (Enterprise plan only).")
    }).describe("The content and configuration of the frame"),
    position: z.object({
      x: z.number().describe("X coordinate of the frame"),
      y: z.number().describe("Y coordinate of the frame")
    }).describe("Position of the frame on the board"),
    geometry: z.object({
      width: z.number().optional().describe("Width of the frame"),
      height: z.number().optional().describe("Height of the frame")
    }).optional().describe("Dimensions of the frame"),
    style: z.object({
      fillColor: z.string().optional().describe("Fill color for the frame. Hex values like #f5f6f8, #d5f692, etc.")
    }).optional().describe("Style configuration of the frame")
  },
  fn: async ({ boardId, data, position, geometry, style }: {
    boardId: string,
    data: {
      title?: string,
      format?: string,
      type?: string,
      showContent?: boolean
    },
    position: {
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

      const createRequest = new FrameCreateRequest();
      
      const frameData = new FrameChanges();
      
      if (data.title !== undefined) frameData.title = data.title;
      if (data.format !== undefined) frameData.format = data.format;
      if (data.type !== undefined) frameData.type = data.type;
      if (data.showContent !== undefined) frameData.showContent = data.showContent;
      
      createRequest.data = frameData;
      createRequest.position = position;
      
      if (geometry) {
        createRequest.geometry = geometry;
      }
      
      if (style) {
        createRequest.style = style;
      }

      const result = await MiroClient.getApi().createFrameItem(boardId, createRequest);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default createFrameItemTool;