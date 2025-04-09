import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ZodRawShape } from 'zod';

export type ToolSchema = {
  name: string;
  description: string;
  args: ZodRawShape;
  fn: ToolCallback<any>;
}