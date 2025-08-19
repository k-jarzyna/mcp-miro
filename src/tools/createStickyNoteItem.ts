import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

import { StickyNoteCreateRequest } from '@mirohq/miro-api/dist/model/stickyNoteCreateRequest.js';
import { StickyNoteData } from '@mirohq/miro-api/dist/model/stickyNoteData.js';

const validColors = [
  'light_yellow', 'yellow', 'orange', 
  'light_green', 'green', 
  'light_blue', 'blue', 
  'light_pink', 'pink',
  'light_purple', 'purple',
  'black', 'gray', 'light_gray', 'white'
];

const validTextAligns = ['left', 'center', 'right'];

const validShapes = ['square', 'rectangle', 'circle', 'triangle', 'rhombus'];

const createStickyNoteItemTool: ToolSchema = {
  name: "create-sticky-note-item",
  description: "Create a new sticky note item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board where the sticky note will be created"),
    data: z.object({
      content: z.string().describe("Text content of the sticky note"),
      shape: z.string().optional().nullish().describe("Shape of the sticky note (square, rectangle, circle, triangle, rhombus)")
    }).describe("The content and configuration of the sticky note"),
    position: z.object({
      x: z.number().describe("X coordinate of the sticky note"),
      y: z.number().describe("Y coordinate of the sticky note"),
      origin: z.string().optional().nullish().describe("Origin of the sticky note (center, top-left, etc.)"),
      relativeTo: z.string().optional().nullish().describe("Reference point (canvas_center, etc.)")
    }).describe("Position of the sticky note on the board"),
    geometry: z.object({
      width: z.number().optional().nullish().describe("Width of the sticky note"),
      height: z.number().optional().nullish().describe("Height of the sticky note")
    }).optional().nullish().describe("Dimensions of the sticky note"),
    style: z.object({
      fillColor: z.string().optional().nullish().describe("Fill color of the sticky note (use predefined values like 'light_yellow', 'light_green', etc.)"),
      textAlign: z.string().optional().nullish().describe("Alignment of the text (left, center, right)")
    }).optional().nullish().describe("Style configuration of the sticky note")
  },
  fn: async ({ boardId, data, position, geometry, style }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      const createRequest = new StickyNoteCreateRequest();
      
      const stickyNoteData = new StickyNoteData();
      stickyNoteData.content = data.content;
      
      if (data.shape) {
        if (!validShapes.includes(data.shape)) {
          console.warn(`Invalid shape: ${data.shape}. Using default: square`);
          stickyNoteData.shape = 'square';
        } else {
          stickyNoteData.shape = data.shape;
        }
      } else {
        stickyNoteData.shape = 'square';
      }
      
      createRequest.data = stickyNoteData;
      
      const completePosition = {
        ...position,
        origin: position.origin || "center",
        relativeTo: position.relativeTo || "canvas_center"
      };
      createRequest.position = completePosition;
      
      if (geometry) {
        createRequest.geometry = geometry;
      }
      
      if (style) {
        const validatedStyle: Record<string, any> = {};
        
        if (style.fillColor) {
          if (!validColors.includes(style.fillColor)) {
            console.warn(`Invalid color: ${style.fillColor}. Using default: light_yellow`);
            validatedStyle.fillColor = 'light_yellow';
          } else {
            validatedStyle.fillColor = style.fillColor;
          }
        } else {
          validatedStyle.fillColor = 'light_yellow';
        }
        
        if (style.textAlign) {
          if (!validTextAligns.includes(style.textAlign)) {
            console.warn(`Invalid text alignment: ${style.textAlign}. Using default: center`);
            validatedStyle.textAlign = 'center';
          } else {
            validatedStyle.textAlign = style.textAlign;
          }
        } else {
          validatedStyle.textAlign = 'center';
        }
        
        createRequest.style = validatedStyle;
      } else {
        createRequest.style = {
          fillColor: 'light_yellow',
          textAlign: 'center'
        };
      }

      const result = await MiroClient.getApi().createStickyNoteItem(boardId, createRequest);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default createStickyNoteItemTool;