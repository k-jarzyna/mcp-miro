import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

import { TagUpdateRequest } from '@mirohq/miro-api/dist/model/tagUpdateRequest.js';

const updateTagTool: ToolSchema = {
  name: "update-tag",
  description: "Update an existing tag on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board that contains the tag"),
    tagId: z.string().describe("Unique identifier (ID) of the tag that you want to update"),
    title: z.string().optional().describe("Updated title of the tag"),
    fillColor: z.string().optional().describe("Updated fill color of the tag (hex format, e.g. #000000)")
  },
  fn: async ({ boardId, tagId, title, fillColor }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!tagId) {
        return ServerResponse.error("Tag ID is required");
      }

      const updateRequest = new TagUpdateRequest();
      
      if (title !== undefined) {
        updateRequest.title = title;
      }
      
      if (fillColor !== undefined) {
        updateRequest.fillColor = fillColor;
      }

      const result = await MiroClient.getApi().updateTag(boardId, tagId, updateRequest);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default updateTagTool;