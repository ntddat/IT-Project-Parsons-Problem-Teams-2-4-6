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

    return await chatHisoryModel.find({
        userID: userID,
    });
}



def transform_history_for_gemini(history):
    transformed_history = []
    for message in history:
        transformed_message = {
            "role": message["role"],
            "parts": [
                {
                    "text": message["content"]
                }
            ]
        }
        transformed_history.append(transformed_message)
    return transformed_history


    // this is to find the user and returns their past questions
    // db.collection.findOne({ userID: "12345" }, { pastQuestions: 1, _id: 0 });



// i think we need to store the prompts in the chathistorymodel, so that i can format it into the way gemini wants it to be for chat history
// there is a role "user" and "model"

// how are we storing the chat history ?
// for example if a user has 2 previous chat history are we storing them into 2 separate objects in the database or concat the strings 
// together into one long string



