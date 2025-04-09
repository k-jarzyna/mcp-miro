import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({
  name: "mcp-miro",
  version: "1.0.0",
  capabilities: {
    tools: { listChanged: true },
    resources: { listChanged: true }
  }
});

export default server;