#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as dotenv from "dotenv";
import server from './server.js';
import { ToolBootstrapper } from './tool-bootstrapper.js';
import listBoardsTool from './tools/listBoards.js';
import createBoardTool from './tools/createBoard.js';
import updateBoardTool from './tools/updateBoard.js';
import deleteBoardTool from './tools/deleteBoard.js';
import copyBoardTool from './tools/copyBoard.js';
import getSpecificBoardTool from './tools/getSpecificBoard.js';
import getItemsOnBoardTool from './tools/getItemsOnBoard.js';
import getSpecificItemTool from './tools/getSpecificItem.js';
import updateItemPositionTool from './tools/updateItemPosition.js';
import deleteItemTool from './tools/deleteItem.js';
import createAppCardItemTool from './tools/createAppCardItem.js';
import getAppCardItemTool from './tools/getAppCardItem.js';
import updateAppCardItemTool from './tools/updateAppCardItem.js';
import deleteAppCardItemTool from './tools/deleteAppCardItem.js';
import createCardItemTool from './tools/createCardItem.js';
import getCardItemTool from './tools/getCardItem.js';
import updateCardItemTool from './tools/updateCardItem.js';
import deleteCardItemTool from './tools/deleteCardItem.js';
import createConnectorTool from './tools/createConnector.js';
import getConnectorsTool from './tools/getConnectors.js';
import getSpecificConnectorTool from './tools/getSpecificConnector.js';
import updateConnectorTool from './tools/updateConnector.js';
import deleteConnectorTool from './tools/deleteConnector.js';
import createStickyNoteItemTool from './tools/createStickyNoteItem.js';
import getStickyNoteItemTool from './tools/getStickyNoteItem.js';
import updateStickyNoteItemTool from './tools/updateStickyNoteItem.js';
import deleteStickyNoteItemTool from './tools/deleteStickyNoteItem.js';
import createFrameItemTool from './tools/createFrameItem.js';
import getFrameItemTool from './tools/getFrameItem.js';
import updateFrameItemTool from './tools/updateFrameItem.js';
import deleteFrameItemTool from './tools/deleteFrameItem.js';
import createDocumentItemTool from './tools/createDocumentItem.js';
import getDocumentItemTool from './tools/getDocumentItem.js';
import updateDocumentItemTool from './tools/updateDocumentItem.js';
import deleteDocumentItemTool from './tools/deleteDocumentItem.js';
import createTextItemTool from './tools/createTextItem.js';
import getTextItemTool from './tools/getTextItem.js';
import updateTextItemTool from './tools/updateTextItem.js';
import deleteTextItemTool from './tools/deleteTextItem.js';
import createItemsInBulkTool from './tools/createItemsInBulk.js';
import createItemsInBulkUsingFileTool from './tools/createItemsInBulkUsingFile.js';
import createImageItemUsingUrlTool from './tools/createImageItemUsingUrl.js';
import createImageItemUsingFileFromDeviceTool from './tools/createImageItemUsingFileFromDevice.js';
import getImageItemTool from './tools/getImageItem.js';
import updateImageItemTool from './tools/updateImageItem.js';
import updateImageItemUsingFileFromDeviceTool from './tools/updateImageItemUsingFileFromDevice.js';
import deleteImageItemTool from './tools/deleteImageItem.js';
import createShapeItemTool from './tools/createShapeItem.js';
import getShapeItemTool from './tools/getShapeItem.js';
import updateShapeItemTool from './tools/updateShapeItem.js';
import deleteShapeItemTool from './tools/deleteShapeItem.js';
import createEmbedItemTool from './tools/createEmbedItem.js';
import getEmbedItemTool from './tools/getEmbedItem.js';
import updateEmbedItemTool from './tools/updateEmbedItem.js';
import deleteEmbedItemTool from './tools/deleteEmbedItem.js';
import createTagTool from './tools/createTag.js';
import getTagTool from './tools/getTag.js';
import getAllTagsTool from './tools/getAllTags.js';
import updateTagTool from './tools/updateTag.js';
import deleteTagTool from './tools/deleteTag.js';
import attachTagTool from './tools/attachTag.js';
import detachTagTool from './tools/detachTag.js';
import getItemTagsTool from './tools/getItemTags.js';
import getAllBoardMembers from './tools/getAllBoardMembers.js';
import getSpecificBoardMemberTool from './tools/getSpecificBoardMember.js';
import removeBoardMemberTool from './tools/removeBoardMember.js';
import shareBoardTool from './tools/shareBoard.js';
import updateBoardMemberTool from './tools/updateBoardMember.js';
import getAllGroupsTool from './tools/getAllGroups.js';
import getGroupTool from './tools/getGroup.js';
import getGroupItemsTool from './tools/getGroupItems.js';
import updateGroupTool from './tools/updateGroup.js';
import ungroupItemsTool from './tools/ungroupItems.js';
import deleteGroupTool from './tools/deleteGroup.js';
import createGroupTool from './tools/createGroup.js';
import createMindmapNodeTool from './tools/createMindmapNode.js';
import getMindmapNodeTool from './tools/getMindmapNode.js';
import getMindmapNodesTool from './tools/getMindmapNodes.js';
import deleteMindmapNodeTool from './tools/deleteMindmapNode.js';
import getBoardClassificationTool from './tools/getBoardClassification.js';
import updateBoardClassificationTool from './tools/updateBoardClassification.js';
import createBoardExportJobTool from './tools/createBoardExportJob.js';
import getBoardExportJobStatusTool from './tools/getBoardExportJobStatus.js';
import getBoardExportJobResultsTool from './tools/getBoardExportJobResults.js';
import getAuditLogsTool from './tools/getAuditLogs.js';
import getOrganizationInfoTool from './tools/getOrganizationInfo.js';
import getOrganizationMembersTool from './tools/getOrganizationMembers.js';
import getOrganizationMemberTool from './tools/getOrganizationMember.js';
import addProjectMemberTool from './tools/addProjectMember.js';
import getProjectMemberTool from './tools/getProjectMember.js';
import removeProjectMemberTool from './tools/removeProjectMember.js';
import getAllCasesTool from './tools/getAllCases.js';
import getCaseTool from './tools/getCase.js';
import getLegalHoldsTool from './tools/getAllLegalHolds.js';
import getLegalHoldTool from './tools/getLegalHold.js';
import getLegalHoldContentItemsTool from './tools/getLegalHoldContentItems.js';
import getBoardContentLogsTool from './tools/getBoardContentLogs.js';

dotenv.config();

new ToolBootstrapper(server)
  .register(listBoardsTool)
  .register(createBoardTool)
  .register(updateBoardTool)
  .register(deleteBoardTool)
  .register(copyBoardTool)
  .register(getSpecificBoardTool)
  .register(getItemsOnBoardTool)
  .register(getSpecificItemTool)
  .register(updateItemPositionTool)
  .register(deleteItemTool)
  .register(createAppCardItemTool)
  .register(getAppCardItemTool)
  .register(updateAppCardItemTool)
  .register(deleteAppCardItemTool)
  .register(createCardItemTool)
  .register(getCardItemTool)
  .register(updateCardItemTool)
  .register(deleteCardItemTool)
  .register(createConnectorTool)
  .register(getConnectorsTool)
  .register(getSpecificConnectorTool)
  .register(updateConnectorTool)
  .register(deleteConnectorTool)
  .register(createStickyNoteItemTool)
  .register(getStickyNoteItemTool)
  .register(updateStickyNoteItemTool)
  .register(deleteStickyNoteItemTool)
  .register(createFrameItemTool)
  .register(getFrameItemTool)
  .register(updateFrameItemTool)
  .register(deleteFrameItemTool)
  .register(createDocumentItemTool)
  .register(getDocumentItemTool)
  .register(updateDocumentItemTool)
  .register(deleteDocumentItemTool)
  .register(createTextItemTool)
  .register(getTextItemTool)
  .register(updateTextItemTool)
  .register(deleteTextItemTool)
  .register(createItemsInBulkTool)
  .register(createImageItemUsingUrlTool)
  .register(createImageItemUsingFileFromDeviceTool)
  .register(getImageItemTool)
  .register(updateImageItemTool)
  .register(updateImageItemUsingFileFromDeviceTool)
  .register(deleteImageItemTool)
  .register(createShapeItemTool)
  .register(getShapeItemTool)
  .register(updateShapeItemTool)
  .register(deleteShapeItemTool)
  .register(createEmbedItemTool)
  .register(getEmbedItemTool)
  .register(updateEmbedItemTool)
  .register(deleteEmbedItemTool)
  .register(createTagTool)
  .register(getTagTool)
  .register(getAllTagsTool)
  .register(updateTagTool)
  .register(deleteTagTool)
  .register(attachTagTool)
  .register(detachTagTool)
  .register(getItemTagsTool)
  .register(getAllBoardMembers)
  .register(getSpecificBoardMemberTool)
  .register(removeBoardMemberTool)
  .register(shareBoardTool)
  .register(updateBoardMemberTool)
  .register(createGroupTool)
  .register(getAllGroupsTool)
  .register(getGroupTool)
  .register(getGroupItemsTool)
  .register(updateGroupTool)
  .register(ungroupItemsTool)
  .register(deleteGroupTool)
  .register(createItemsInBulkUsingFileTool)
  .register(createMindmapNodeTool)
  .register(getMindmapNodeTool)
  .register(getMindmapNodesTool)
  .register(deleteMindmapNodeTool)
  .register(getBoardClassificationTool)
  .register(updateBoardClassificationTool)
  .register(createBoardExportJobTool)
  .register(getBoardExportJobStatusTool)
  .register(getBoardExportJobResultsTool)
  .register(getAuditLogsTool)
  .register(getOrganizationInfoTool)
  .register(getOrganizationMembersTool)
  .register(getOrganizationMemberTool)
  .register(addProjectMemberTool)
  .register(getProjectMemberTool)
  .register(removeProjectMemberTool)
  .register(getAllCasesTool)
  .register(getCaseTool)
  .register(getLegalHoldsTool)
  .register(getLegalHoldTool)
  .register(getLegalHoldContentItemsTool)
  .register(getBoardContentLogsTool);

async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);

    if (!process.env.MIRO_ACCESS_TOKEN) {
      process.stderr.write("Warning: MIRO_ACCESS_TOKEN environment variable is not set. The server will not be able to connect to Miro.\n");
    }
  } catch (error) {
    process.stderr.write(`Server error: ${error}\n`);
    process.exit(1);
  }
}

main().catch(error => {
  process.stderr.write(`Fatal error: ${error}\n`);
  process.exit(1);
});