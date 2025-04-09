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

const stickyNoteSchema = z.object({
  type: z.literal('sticky_note'),
  data: z.object({
    content: z.string().describe("Text content of the sticky note"),
    shape: z.enum(['square', 'rectangle']).optional().describe("Shape of the sticky note")
  }),
  position: z.object({
    x: z.number().describe("X coordinate"),
    y: z.number().describe("Y coordinate")
  }),
  style: z.object({
    fillColor: z.string().optional().describe("Fill color of the sticky note"),
    textAlign: z.enum(['left', 'center', 'right']).optional().describe("Text alignment")
  }).optional()
});

const cardSchema = z.object({
  type: z.literal('card'),
  data: z.object({
    title: z.string().describe("Title of the card"),
    description: z.string().optional().describe("Description of the card"),
    assigneeId: z.string().optional().describe("User ID of the assignee"),
    dueDate: z.string().optional().describe("Due date in ISO 8601 format")
  }),
  position: z.object({
    x: z.number().describe("X coordinate"),
    y: z.number().describe("Y coordinate")
  }),
  style: z.object({
    fillColor: z.string().optional().describe("Fill color"),
    textColor: z.string().optional().describe("Text color")
  }).optional()
});

const textSchema = z.object({
  type: z.literal('text'),
  data: z.object({
    content: z.string().describe("Text content")
  }),
  position: z.object({
    x: z.number().describe("X coordinate"),
    y: z.number().describe("Y coordinate")
  }),
  style: z.object({
    color: z.string().optional().describe("Text color (hex format, e.g. #000000)"),
    fontSize: z.number().optional().describe("Font size"),
    textAlign: z.enum(['left', 'center', 'right']).optional().describe("Text alignment")
  }).optional()
});

const itemSchema = z.discriminatedUnion('type', [
  stickyNoteSchema,
  cardSchema,
  textSchema
]);

const createItemsInBulkTool: ToolSchema = {
  name: "create-items-in-bulk",
  description: "Create multiple items on a Miro board in a single operation",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board where the items will be created"),
    items: z.array(itemSchema).describe("Array of items to create")
  },
  fn: async ({ boardId, items }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return ServerResponse.error("At least one item is required");
      }

      const results = [];
      const errors = [];

      const createPromises = items.map(async (item, index) => {
        try {
          let result;
          
          if (item.type === 'sticky_note') {
            result = await createStickyNote(boardId, item);
          } else if (item.type === 'card') {
            result = await createCard(boardId, item);
          } else if (item.type === 'text') {
            result = await createText(boardId, item);
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

async function createStickyNote(boardId: string, item: z.infer<typeof stickyNoteSchema>) {
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

async function createCard(boardId: string, item: z.infer<typeof cardSchema>) {
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

// Helper function to create a text item
async function createText(boardId: string, item: z.infer<typeof textSchema>) {
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

export default createItemsInBulkTool;