# MCP Miro Server

Model Context Protocol (MCP) server integrating with the [Miro](https://miro.com/) platform. It enables AI assistants (like Claude) to access Miro boards and manage their content through a standardized interface.

---
### Requirements

- Node.js v16 or newer installed
- Miro account with API token

### Generate Miro Access Token

1. Go to the [Miro Developer Portal](https://developers.miro.com/docs)
2. Create a new app or use an existing one
3. Make sure to create token with permission selected below
4. Generate OAuth token by selecting `Install app and get OAuth token`

| Permission        | Required |
|-------------------|:--------:|
| boards:read       |    ✅     |
| boards:write      |    ✅     |
| identity:read     |    ✅     |
| identity:write    |    ✅     |
| team:read         |    ✅     |
| team:write        |    ✅     |
| microphone:listen |    ❌     |
| screen:record     |    ❌     |
| webcam:record     |    ❌     |
| auditlogs:read    |    ❌     |
| sessions:delete   |    ❌     |

### Connecting with Claude Desktop

1. Install [Claude Desktop](https://claude.ai/download)
2. Open or create the configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

3. Update it to include this server:

```json
{
   "mcpServers":{
      "miro":{
         "command":"npx",
         "args":[
            "-y",
            "@k-jarzyna/mcp-miro"
         ],
         "env":{
            "MIRO_ACCESS_TOKEN":"your_miro_access_token"
         }
      }
   }
}
```

4. Restart Claude Desktop

---
## Available Tools and Resources

#### Tools
| Miro SDK Function | MCP Tool | Available |
|-------------------|----------|-----------|
| List boards | list-boards | ✅ |
| Create board | create-board | ✅ |
| Update board | update-board | ✅ |
| Delete board | delete-board | ✅ |
| Copy board | copy-board | ✅ |
| Get specific board | get-specific-board | ✅ |
| Get items on board | get-items-on-board | ✅ |
| Get specific item | get-specific-item | ✅ |
| Update item position | update-item-position | ✅ |
| Delete item | delete-item | ✅ |
| Create app card item | create-app-card-item | ✅ |
| Get app card item | get-app-card-item | ✅ |
| Update app card item | update-app-card-item | ✅ |
| Delete app card item | delete-app-card-item | ✅ |
| Create card item | create-card-item | ✅ |
| Get card item | get-card-item | ✅ |
| Update card item | update-card-item | ✅ |
| Delete card item | delete-card-item | ✅ |
| Create connector | create-connector | ✅ |
| Get connectors | get-connectors | ✅ |
| Get specific connector | get-specific-connector | ✅ |
| Update connector | update-connector | ✅ |
| Delete connector | delete-connector | ✅ |
| Create sticky note item | create-sticky-note-item | ✅ |
| Get sticky note item | get-sticky-note-item | ✅ |
| Update sticky note item | update-sticky-note-item | ✅ |
| Delete sticky note item | delete-sticky-note-item | ✅ |
| Create frame | create-frame | ✅ |
| Get frame item | get-frame-item | ✅ |
| Update frame item | update-frame-item | ✅ |
| Delete frame item | delete-frame-item | ✅ |
| Create document item | create-document-item | ✅ |
| Get document item | get-document-item | ✅ |
| Update document item | update-document-item | ✅ |
| Delete document item | delete-document-item | ✅ |
| Create text item | create-text-item | ✅ |
| Get text item | get-text-item | ✅ |
| Update text item | update-text-item | ✅ |
| Delete text item | delete-text-item | ✅ |
| Create items in bulk | create-items-in-bulk | ✅ |
| Create image item using URL | create-image-item-using-url | ✅ |
| Create image item using file | create-image-item-using-file | ✅ |
| Get image item | get-image-item | ✅ |
| Update image item | update-image-item | ✅ |
| Update image item using file | update-image-item-using-file | ✅ |
| Delete image item | delete-image-item | ✅ |
| Create shape item | create-shape-item | ✅ |
| Get shape item | get-shape-item | ✅ |
| Update shape item | update-shape-item | ✅ |
| Delete shape item | delete-shape-item | ✅ |
| Create embed item | create-embed-item | ✅ |
| Get embed item | get-embed-item | ✅ |
| Update embed item | update-embed-item | ✅ |
| Delete embed item | delete-embed-item | ✅ |
| Create tag | create-tag | ✅ |
| Get tag | get-tag | ✅ |
| Get all tags | get-all-tags | ✅ |
| Update tag | update-tag | ✅ |
| Delete tag | delete-tag | ✅ |
| Attach tag | attach-tag | ✅ |
| Detach tag | detach-tag | ✅ |
| Get item tags | get-item-tags | ✅ |
| Get all board members | get-all-board-members | ✅ |
| Get specific board member | get-specific-board-member | ✅ |
| Remove board member | remove-board-member | ✅ |
| Share board | share-board | ✅ |
| Update board member | update-board-member | ✅ |
| Create group | create-group | ✅ |
| Get all groups | get-all-groups | ✅ |
| Get group | get-group | ✅ |
| Get group items | get-group-items | ✅ |
| Update group | update-group | ✅ |
| Ungroup items | ungroup-items | ✅ |
| Delete group | delete-group | ✅ |
| Create items in bulk using file | create-items-in-bulk-using-file | ✅ |
| Create mindmap node | create-mindmap-node | ✅ |
| Get mindmap node | get-mindmap-node | ✅ |
| Get mindmap nodes | get-mindmap-nodes | ✅ |
| Delete mindmap node | delete-mindmap-node | ✅ |
| Add project member | add-project-member | ✅ |
| Create board export job | create-board-export-job | ✅ |
| Get all cases | get-all-cases | ✅ |
| Get all legal holds | get-all-legal-holds | ✅ |
| Get audit logs | get-audit-logs | ✅ |
| Get board classification | get-board-classification | ✅ |
| Get board content logs | get-board-content-logs | ✅ |
| Get board export job results | get-board-export-job-results | ✅ |
| Get board export job status | get-board-export-job-status | ✅ |
| Get case | get-case | ✅ |
| Get legal hold | get-legal-hold | ✅ |
| Get legal hold content items | get-legal-hold-content-items | ✅ |
| Get organization info | get-organization-info | ✅ |
| Get organization member | get-organization-member | ✅ |
| Get organization members | get-organization-members | ✅ |
| Get project member | get-project-member | ✅ |
| Remove project member | remove-project-member | ✅ |
| Update board classification | update-board-classification | ✅ |


---
## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on the template:

```bash
cp .env.template .env
```

3. Edit the `.env` file and add your Miro access token

4. Build the server:

```bash
npm run build
```

### Running the Server

To run the server:

```bash
node build/index.js
```

---
## License

Apache License 2.0

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for details.