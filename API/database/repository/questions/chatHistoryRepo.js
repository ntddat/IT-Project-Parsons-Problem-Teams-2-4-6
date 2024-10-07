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

    const chatHistory = await chatHisoryModel.find(
        {userID: userID},
        {prompt: 1, question:1, _id:0}
    );

    let transformedHistory = []
    chatHistory.forEach((item) => {
        const user = {
            role: "user",
            parts: [
                {
                    text: item.prompt
                }
            ]
        };
        const model = {
            role: "model",
            parts: [
                {
                    text:item.question
                }
            ]
        };
       
        transformedHistory.push(user, model)
    });

    console.log(transformedHistory);
    
}





