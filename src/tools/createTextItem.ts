import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

import { TextCreateRequest } from '@mirohq/miro-api/dist/model/textCreateRequest.js';
import { TextData } from '@mirohq/miro-api/dist/model/textData.js';

const createTextItemTool: ToolSchema = {
  name: "create-text-item",
  description: "Create a new text item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board where the text will be created"),
    data: z.object({
      content: z.string().describe("Text content of the text item")
    }).describe("The content of the text item"),
    position: z.object({
      x: z.number().describe("X coordinate of the text item"),
      y: z.number().describe("Y coordinate of the text item")
    }).describe("Position of the text item on the board"),
    geometry: z.object({
      width: z.number().optional().nullish().describe("Width of the text item")
    }).optional().nullish().describe("Dimensions of the text item"),
    style: z.object({
      color: z.string().optional().nullish().describe("Color of the text"),
      fontSize: z.number().optional().nullish().describe("Font size of the text"),
      textAlign: z.string().optional().nullish().describe("Alignment of the text (left, center, right)")
    }).optional().nullish().describe("Style configuration of the text item")
  },
  fn: async ({ boardId, data, position, geometry, style }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      const createRequest = new TextCreateRequest();
      
      const textData = new TextData();
      textData.content = data.content;
      
      createRequest.data = textData;
      createRequest.position = position;
      
      if (geometry) {
        createRequest.geometry = geometry;
      }
      
      if (style) {
        createRequest.style = style;
      }

      const result = await MiroClient.getApi().createTextItem(boardId, createRequest);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default createTextItemTool;