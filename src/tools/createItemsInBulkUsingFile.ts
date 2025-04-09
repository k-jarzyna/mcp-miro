import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

import { StickyNoteCreateRequest } from '@mirohq/miro-api/dist/model/stickyNoteCreateRequest.js';
import { StickyNoteData } from '@mirohq/miro-api/dist/model/stickyNoteData.js';
import { CardCreateRequest } from '@mirohq/miro-api/dist/model/cardCreateRequest.js';
import { CardData } from '@mirohq/miro-api/dist/model/cardData.js';
import { TextCreateRequest } from '@mirohq/miro-api/dist/model/textCreateRequest.js';
import { TextData } from '@mirohq/miro-api/dist/model/textData.js';

const validStickyNoteColors = [
  'light_yellow', 'yellow', 'orange', 
  'light_green', 'green', 
  'light_blue', 'blue', 
  'light_pink', 'pink',
  'light_purple', 'purple',
  'black', 'gray', 'white'
];

const validStickyNoteShapes = ['square', 'rectangle'];
const validTextAligns = ['left', 'center', 'right'];

const createItemsInBulkUsingFileTool: ToolSchema = {
  name: "create-items-in-bulk-using-file",
  description: "Create multiple items on a Miro board in a single operation using a JSON file from device",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board where the items will be created"),
    fileData: z.string().describe("Base64 encoded JSON file data containing items to create")
  },
  fn: async ({ boardId, fileData }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }
      
      if (!fileData) {
        return ServerResponse.error("File data is required");
      }

      // Decode the base64 file data
      let jsonData;
      try {
        const base64Data = fileData.replace(/^data:application\/json;base64,/, '');
        const fileBuffer = Buffer.from(base64Data, 'base64');
        const fileContent = fileBuffer.toString('utf-8');
        jsonData = JSON.parse(fileContent);
      } catch (error) {
        return ServerResponse.error(`Error decoding or parsing JSON file data: ${error.message}`);
      }

      // Validate that the decoded data contains an 'items' array
      if (!jsonData.items || !Array.isArray(jsonData.items) || jsonData.items.length === 0) {
        return ServerResponse.error("JSON file must contain a non-empty 'items' array");
      }

      const items = jsonData.items;
      const results = [];
      const errors = [];

      const createPromises = items.map(async (item, index) => {
        try {
          // Validate item structure
          if (!item.type || !item.data || !item.position) {
            throw new Error(`Item at index ${index} is missing required fields (type, data, or position)`);
          }

          let result;
          
          if (item.type === 'sticky_note') {
            result = await createStickyNote(boardId, item);
          } else if (item.type === 'card') {
            result = await createCard(boardId, item);
          } else if (item.type === 'text') {
            result = await createText(boardId, item);
          } else {
            throw new Error(`Unsupported item type: ${item.type}`);
          }
          
          return { index, result };
        } catch (error) {
          return { index, error: error.message || String(error) };
        }
      });
      
      const promiseResults = await Promise.all(createPromises);
      
      for (const promiseResult of promiseResults) {
        const { index, result, error } = promiseResult;
        if (error) {
          errors.push({ index, error });
        } else if (result) {
          results.push({ index, item: result });
        }
      }
      
      return ServerResponse.text(JSON.stringify({
        created: results.length,
        failed: errors.length,
        results,
        errors
      }, null, 2));
      
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

async function createStickyNote(boardId: string, item: any) {
  const createRequest = new StickyNoteCreateRequest();
  
  const stickyNoteData = new StickyNoteData();
  stickyNoteData.content = item.data.content;
  stickyNoteData.shape = item.data.shape || 'square';
  
  createRequest.data = stickyNoteData;
  createRequest.position = item.position;
  
  if (item.style) {
    const style: Record<string, string> = {};
    
    if (item.style.fillColor) {
      if (validStickyNoteColors.includes(item.style.fillColor)) {
        style.fillColor = item.style.fillColor;
      } else {
        style.fillColor = 'light_yellow';
      }
    }
    
    if (item.style.textAlign) {
      if (validTextAligns.includes(item.style.textAlign)) {
        style.textAlign = item.style.textAlign;
      } else {
        style.textAlign = 'center';
      }
    }
    
    createRequest.style = style;
  }
  
  return await MiroClient.getApi().createStickyNoteItem(boardId, createRequest);
}

async function createCard(boardId: string, item: any) {
  const createRequest = new CardCreateRequest();
  
  const cardData = new CardData();
  cardData.title = item.data.title;
  
  if (item.data.description) {
    cardData.description = item.data.description;
  }
  
  if (item.data.assigneeId) {
    cardData.assigneeId = item.data.assigneeId;
  }
  
  if (item.data.dueDate) {
    cardData.dueDate = new Date(item.data.dueDate);
  }
  
  createRequest.data = cardData;
  createRequest.position = item.position;
  
  if (item.style) {
    createRequest.style = item.style as Record<string, any>;
  }
  
  return await MiroClient.getApi().createCardItem(boardId, createRequest);
}

async function createText(boardId: string, item: any) {
  const createRequest = new TextCreateRequest();
  
  const textData = new TextData();
  textData.content = item.data.content;
  
  createRequest.data = textData;
  createRequest.position = item.position;
  
  if (item.style) {
    createRequest.style = item.style as Record<string, any>;
  }
  
  return await MiroClient.getApi().createTextItem(boardId, createRequest);
}

export default createItemsInBulkUsingFileTool;