import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

import { TagCreateRequest } from '@mirohq/miro-api/dist/model/tagCreateRequest.js';

const createTagTool: ToolSchema = {
  name: "create-tag",
  description: "Create a new tag on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board where the tag will be created"),
    data: z.object({
      title: z.string().describe("Title of the tag")
    }).describe("The content and configuration of the tag"),
    fillColor: z.string().optional().describe("Fill color of the tag (hex format, e.g. #000000)")
  },
  fn: async ({ boardId, data, fillColor }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      const createRequest = new TagCreateRequest();
      createRequest.title = data.title;
      
      if (fillColor) {
        createRequest.fillColor = fillColor;
      }

      const result = await MiroClient.getApi().createTag(boardId, createRequest);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default createTagTool;