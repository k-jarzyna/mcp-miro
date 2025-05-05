import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

const updateShapeItemTool: ToolSchema = {
  name: "update-shape-item",
  description: "Update an existing shape item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the shape"),
    itemId: z.string().describe("Unique identifier (ID) of the shape that you want to update"),
    data: z.object({
      shape: z.string().optional().describe("Updated type of the shape (rectangle, circle, triangle, etc.)"),
      content: z.string().optional().describe("Updated text content to display inside the shape")
    }).optional().describe("The updated content and configuration of the shape"),
    position: z.object({
      x: z.number().describe("Updated X coordinate of the shape"),
      y: z.number().describe("Updated Y coordinate of the shape")
    }).optional().describe("Updated position of the shape on the board"),
    geometry: z.object({
      width: z.number().optional().describe("Updated width of the shape"),
      height: z.number().optional().describe("Updated height of the shape"),
      rotation: z.number().optional().describe("Rotation angle of the shape")
    }).optional().describe("Updated dimensions of the shape"),
    style: z.object({
      borderColor: z.string().optional().describe("Updated color of the shape border (hex format, e.g. #000000)"),
      borderWidth: z.number().optional().describe("Updated width of the shape border"),
      borderStyle: z.string().optional().describe("Updated style of the shape border (normal, dashed, etc.)"),
      borderOpacity: z.number().optional().describe("Updated opacity of the shape border (0-1)"),
      fillColor: z.string().optional().describe("Updated fill color of the shape (hex format, e.g. #000000)"),
      fillOpacity: z.number().optional().describe("Updated opacity of the shape fill (0-1)"),
      color: z.string().optional().describe("Updated color of the text in the shape (hex format, e.g. #000000)")
    }).optional().describe("Updated style configuration of the shape")
  },
  fn: async ({ boardId, itemId, data, position, geometry, style }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }

      const updateRequest: Record<string, any> = {};
      
      if (data) {
        updateRequest.data = data;
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

      const result = await MiroClient.getApi().updateShapeItem(boardId, itemId, updateRequest);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default updateShapeItemTool;