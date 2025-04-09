import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';
import { UploadFileFromDeviceData } from '@mirohq/miro-api/dist/model/uploadFileFromDeviceData.js';
import { RequestFile } from '@mirohq/miro-api/dist/model/models.js';

const createImageItemUsingFileFromDeviceTool: ToolSchema = {
  name: "create-image-item-using-file",
  description: "Create a new image item on a Miro board using file from device or from chat",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board where the image will be created"),
    imageData: z.string().describe("Base64 encoded image data from the chat"),
    position: z.object({
      x: z.number().describe("X coordinate of the image"),
      y: z.number().describe("Y coordinate of the image"),
      origin: z.string().optional().describe("Origin of the image (center, top-left, etc.)"),
      relativeTo: z.string().optional().describe("Reference point (canvas_center, etc.)")
    }).describe("Position of the image on the board"),
    title: z.string().optional().describe("Title of the image")
  },
  fn: async ({ boardId, imageData, position, title }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!imageData) {
        return ServerResponse.error("Image data is required");
      }

      let imageBuffer;
      try {
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        imageBuffer = Buffer.from(base64Data, 'base64');
      } catch (error) {
        return ServerResponse.error(`Error decoding Base64 image data: ${error.message}`);
      }

      try {
        const metadata = {};
        
        if (position) {
          metadata['position'] = {
            ...position,
            origin: position.origin || 'center',
            relativeTo: position.relativeTo || 'canvas_center'
          };
        }
        
        if (title) {
          metadata['title'] = title;
        }

        const result = await MiroClient.getApi().createImageItemUsingLocalFile(boardId, imageBuffer, metadata);
        return ServerResponse.text(JSON.stringify(result, null, 2));
      } catch (error) {
        return ServerResponse.error(`Error uploading image to Miro: ${error.message}`);
      }
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
};

export default createImageItemUsingFileFromDeviceTool;