import { ChatHistorySchema } from "../../models/questions/chatHisoryModel.js";
import { getDatabaseConnection } from "../../index.js";
import { messages } from "../../utils/constants/messages.js";
require('dotenv').config();

export const getChatHistory = async (userID, dbName) => {
    const chatHistoryCollection = process.env.CHAT_HISTORY_COLLECTION;
    if (!chatHistoryCollection) {
        throw new Error(messages.CHAT_HISTORY_COLLECTION_UNDEFINED);
    }
    const dbConnection = getDatabaseConnection(dbName)
    const chatHisoryModel = dbConnection.model(
        chatHistoryCollection,
        ChatHistorySchema
    );

    return await chatHisoryModel.findOne({
        userID: userID,
    });
}