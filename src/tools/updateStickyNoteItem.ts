import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

import { StickyNoteUpdateRequest } from '@mirohq/miro-api/dist/model/stickyNoteUpdateRequest.js';
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

const updateStickyNoteItemTool: ToolSchema = {
  name: "update-sticky-note-item",
  description: "Update an existing sticky note item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the sticky note"),
    itemId: z.string().describe("Unique identifier (ID) of the sticky note that you want to update"),
    data: z.object({
      content: z.string().optional().describe("Updated text content of the sticky note"),
      shape: z.string().optional().describe("Updated shape of the sticky note (square, rectangle, circle, triangle, rhombus)")
    }).optional().describe("Updated content and configuration of the sticky note"),
    position: z.object({
      x: z.number().optional().describe("Updated X coordinate of the sticky note"),
      y: z.number().optional().describe("Updated Y coordinate of the sticky note"),
      origin: z.string().optional().describe("Origin of the sticky note (center, top-left, etc.)"),
      relativeTo: z.string().optional().describe("Reference point (canvas_center, etc.)")
    }).optional().describe("Updated position of the sticky note on the board"),
    geometry: z.object({
      width: z.number().optional().describe("Updated width of the sticky note"),
      height: z.number().optional().describe("Updated height of the sticky note")
    }).optional().describe("Updated dimensions of the sticky note"),
    style: z.object({
      fillColor: z.string().optional().describe("Updated fill color of the sticky note (use predefined values)"),
      textAlign: z.string().optional().describe("Updated alignment of the text (left, center, right)"),
      textColor: z.string().optional().describe("Updated color of the text on the sticky note")
    }).optional().describe("Updated style configuration of the sticky note")
  },
  fn: async ({ boardId, itemId, data, position, geometry, style }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      const updateRequest = new StickyNoteUpdateRequest();
      
      if (data) {
        const stickyNoteData = new StickyNoteData();
        
        if (data.content !== undefined) {
          stickyNoteData.content = data.content;
        }
        
        if (data.shape !== undefined) {
          if (!validShapes.includes(data.shape)) {
            console.warn(`Invalid shape: ${data.shape}. Skipping this field.`);
          } else {
            stickyNoteData.shape = data.shape;
          }
        }
        
        if (Object.keys(stickyNoteData).length > 0) {
          updateRequest.data = stickyNoteData;
        }
      }
      
      if (position) {
        if (position.x !== undefined || position.y !== undefined) {
          const completePosition: Record<string, any> = {};
          
          if (position.x !== undefined) completePosition.x = position.x;
          if (position.y !== undefined) completePosition.y = position.y;
          
          completePosition.origin = position.origin || "center";
          completePosition.relativeTo = position.relativeTo || "canvas_center";
          
          updateRequest.position = completePosition;
        }
      }
      
      if (geometry && Object.keys(geometry).length > 0) {
        updateRequest.geometry = geometry;
      }
      
      if (style) {
        const validatedStyle: Record<string, any> = {};
        
        if (style.fillColor) {
          if (!validColors.includes(style.fillColor)) {
            console.warn(`Invalid color: ${style.fillColor}. Skipping this field.`);
          } else {
            validatedStyle.fillColor = style.fillColor;
          }
        }
        
        if (style.textAlign) {
          if (!validTextAligns.includes(style.textAlign)) {
            console.warn(`Invalid text alignment: ${style.textAlign}. Skipping this field.`);
          } else {
            validatedStyle.textAlign = style.textAlign;
          }
        }
        
        if (style.textColor) {
          validatedStyle.textColor = style.textColor;
        }
        
        if (Object.keys(validatedStyle).length > 0) {
          updateRequest.style = validatedStyle;
        }
      }

      const result = await MiroClient.getApi().updateStickyNoteItem(boardId, itemId, updateRequest);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default updateStickyNoteItemTool;