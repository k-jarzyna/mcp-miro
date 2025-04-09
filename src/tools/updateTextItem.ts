import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';
import { TextUpdateRequest } from '@mirohq/miro-api/dist/model/textUpdateRequest.js';
import { TextData } from '@mirohq/miro-api/dist/model/textData.js';

const updateTextItemTool: ToolSchema = {
  name: "update-text-item",
  description: "Update an existing text item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the text item"),
    itemId: z.string().describe("Unique identifier (ID) of the text item that you want to update"),
    data: z.object({
      content: z.string().optional().describe("Updated text content of the text item")
    }).optional().describe("The updated content of the text item"),
    position: z.object({
      x: z.number().optional().describe("Updated X coordinate of the text item"),
      y: z.number().optional().describe("Updated Y coordinate of the text item")
    }).optional().describe("Updated position of the text item on the board"),
    geometry: z.object({
      width: z.number().optional().describe("Updated width of the text item")
    }).optional().describe("Updated dimensions of the text item"),
    style: z.object({
      color: z.string().optional().describe("Updated color of the text"),
      fontSize: z.number().optional().describe("Updated font size of the text"),
      textAlign: z.string().optional().describe("Updated alignment of the text (left, center, right)")
    }).optional().describe("Updated style configuration of the text item")
  },
  fn: async ({ boardId, itemId, data, position, geometry, style }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!itemId) {
        return ServerResponse.error("Item ID is required");
      }
      
      const updateRequest = new TextUpdateRequest();
      
      if (data) {
        const textData = new TextData();
        
        if (data.content !== undefined) textData.content = data.content;
        
        if (Object.keys(textData).length > 0) {
          updateRequest.data = textData;
        }
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
      
      if (Object.keys(updateRequest).length === 0) {
        return ServerResponse.error("No data provided for update");
      }

      const result = await MiroClient.getApi().updateTextItem(boardId, itemId, updateRequest);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default updateTextItemTool;