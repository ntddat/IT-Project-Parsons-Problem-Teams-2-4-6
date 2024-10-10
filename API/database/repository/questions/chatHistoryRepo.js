import ChatHistorySchema from "../../model/questions/chatHistoryModel.js";
import { getDatabaseConnection } from "../../connection.js";
import dotenv from "dotenv";
dotenv.config();

export const getChatHistory = async (userID, questionsDbName) => {
    const chatHistoryCollection = process.env.CHAT_HISTORY_COLLECTION;
    if (!chatHistoryCollection) {
        throw new Error("Error getting chat history");
    }
    const dbConnection = await getDatabaseConnection(questionsDbName)
    const chatHistoryModel = dbConnection.model(
        chatHistoryCollection,
        ChatHistorySchema
    );

    const chatHistory = await chatHistoryModel.find(
        {userID: 1},
        {prompt: 1, question:1, _id:0}
    );
    console.log(chatHistory)
    let transformedHistory = []
    chatHistory.map((item) => {
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

    console.log(transformedHistory[0].parts);
    // console.log(userID)
    // console.log("testing")
    return transformedHistory;
    
}





