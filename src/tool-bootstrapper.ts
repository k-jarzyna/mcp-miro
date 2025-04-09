import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ToolSchema } from './tool.js';

export class ToolBootstrapper {
  constructor(
    private readonly server: McpServer
  ) {
  }

  public register(tool: ToolSchema): this {
    this.server.tool(tool.name, tool.description, tool.args, tool.fn);

    return this;
  }
}