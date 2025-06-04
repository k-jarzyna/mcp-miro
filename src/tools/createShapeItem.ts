import MiroClient from '../client.js';
import { z } from 'zod';
import { ServerResponse } from '../server-response.js';
import { ToolSchema } from '../tool.js';

import { ShapeCreateRequest } from '@mirohq/miro-api/dist/model/shapeCreateRequest.js';
import { ShapeData } from '@mirohq/miro-api/dist/model/shapeData.js';

const validShapeTypes = ['rectangle', 'round_rectangle', 'circle', 'triangle', 'rhombus', 'parallelogram', 'trapezoid', 'pentagon', 'hexagon', 'octagon', 'wedge_round_rectangle_callout', 'star', 'flow_chart_predefined_process', 'cloud', 'cross', 'can', 'right_arrow', 'left_arrow', 'left_right_arrow', 'left_brace', 'right_brace'];

const createShapeItemTool: ToolSchema = {
  name: "create-shape-item",
  description: "Create a new shape item on a Miro board",
  args: {
    boardId: z.string().describe("Unique identifier (ID) of the board where the shape will be created"),
    data: z.object({
      shape: z.string().describe("Type of the shape (rectangle, circle, triangle, etc.)"),
      content: z.string().optional().nullable().describe("Text content to display inside the shape")
    }).describe("The content and configuration of the shape"),
    position: z.object({
      x: z.number().describe("X coordinate of the shape"),
      y: z.number().describe("Y coordinate of the shape")
    }).describe("Position of the shape on the board"),
    geometry: z.object({
      width: z.number().describe("Width of the shape"),
      height: z.number().describe("Height of the shape"),
      rotation: z.number().optional().nullable().describe("Rotation angle of the shape")
    }).describe("Dimensions of the shape"),
    style: z.object({
      borderColor: z.string().optional().nullable().describe("Color of the shape border (hex format, e.g. #000000)"),
      borderWidth: z.number().optional().nullable().describe("Width of the shape border"),
      borderStyle: z.string().optional().nullable().describe("Style of the shape border (normal, dashed, etc.)"),
      borderOpacity: z.number().optional().nullable().describe("Opacity of the shape border (0-1)"),
      fillColor: z.string().optional().nullable().describe("Fill color of the shape (hex format, e.g. #000000)"),
      fillOpacity: z.number().optional().nullable().describe("Opacity of the shape fill (0-1)"),
      color: z.string().optional().nullable().describe("Color of the text in the shape (hex format, e.g. #000000)")
    }).optional().nullable().describe("Style configuration of the shape")
  },
  fn: async ({ boardId, data, position, geometry, style }) => {
    try {
      if (!boardId) {
        return ServerResponse.error("Board ID is required");
      }

      if (!validShapeTypes.includes(data.type)) {
        return ServerResponse.error("Invalid shape type. Valid types are: " + validShapeTypes.join(", "));
      }

      const createRequest = new ShapeCreateRequest();
      
      const shapeData = new ShapeData();
      // Set shape type via property assignment
      (shapeData as any).type = data.type;
      
      if (data.content !== undefined) {
        shapeData.content = data.content;
      }
      
      createRequest.data = shapeData;
      
      const completePosition = {
        ...position,
        origin: position.origin || "center",
        relativeTo: position.relativeTo || "canvas_center"
      };
      
      createRequest.position = completePosition;
      createRequest.geometry = geometry;
      
      if (style) {
        createRequest.style = style as Record<string, any>;
      }

      const result = await MiroClient.getApi().createShapeItem(boardId, createRequest);
      return ServerResponse.text(JSON.stringify(result, null, 2));
    } catch (error) {
      return ServerResponse.error(error);
    }
  }
}

export default createShapeItemTool;