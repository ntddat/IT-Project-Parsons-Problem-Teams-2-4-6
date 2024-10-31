import ChatHistorySchema from "../../model/questions/chatHistoryModel.js";
import { getDatabaseConnection } from "../../connection.js";
import dotenv from "dotenv";
dotenv.config();

const getChatHistoryModel = async (questionsDbName) =>{
  const chatHistoryCollection = process.env.CHAT_HISTORY_COLLECTION;
  if (!chatHistoryCollection) {
    throw new Error("Chat history collection is not defined in env file");
  }
  const dbConnection = await getDatabaseConnection(questionsDbName);
  return dbConnection.model(chatHistoryCollection, ChatHistorySchema);
}

const chatHistoryRepo = {
  getChatHistory: async (userID, questionsDbName, topic) => {
    const chatHistoryModel = await getChatHistoryModel(questionsDbName);
    const chatHistory = await chatHistoryModel.find(
      { userID: userID, topic: topic },
      { 
        prompt: 1, 
        question: 1, 
        _id: 0
      }
    );
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
    
    return transformedHistory;
  },
  createNewChatHistory: async (userID, topic, context, prompt, question, questionsDbName) => {
    try {
        const chatHistoryModel = await getChatHistoryModel(questionsDbName);
        const newChatHistory = new chatHistoryModel({
            userID: userID,
            topic: topic,
            context: context,
            question: question,
            prompt: prompt,
        });
        return await newChatHistory.save();
    } catch (e) {
        console.error("Error saving the chat history", e);
        throw e;
    }
  },
  getBackupQuestion: async (userID, topic, context, questionsDbName) => {
    const chatHistoryModel = await getChatHistoryModel(questionsDbName);
    let backup = await chatHistoryModel.findOne(
      { 
        userID: {$ne:userID},
        topic: topic,
        context: context,

      },
      { 
        question: 1, 
        _id: 0,
      }
    );

    if (backup == null || userID == null) {
      backup = await chatHistoryModel.findOne(
        {
          topic: topic,
          context: context,
        },
        {
          question: 1,
          _id: 0,
        }
      );
    }
    return backup;
  }
  
}

export default chatHistoryRepo;




