import { getDatabaseConnection } from "../../index.js";
import attemptModel from "../../model/user/attemptModel.js";
import { AttemptSchema } from "../../models/attemptModel.js";
import { messages } from "../../utils/constants/messages.js";
require('dotenv').config();

const getAttemptModel = async (dbName) => {
  const attemptCollection = process.env.ATTEMPT_COLLECTION;
  if (!attemptCollection) {
    throw new Error(messages.ATTEMPT_COLLECTION_UNDEFINED);
  }
  const dbConnection = await getDatabaseConnection(dbName);
  return dbConnection.model(attemptCollection, AttemptSchema);
}

const attemptRepo = {
  getNumAttemptsQuestion: async (questionID, dbName) => {
    await getAttemptModel(dbName);
    return await attemptModel.find({questionID: questionID}).count();
  },
  getAttemptsDetailsFromQuestionID: async (questionID, dbName) => {
    const attemptModel = await getAttemptModel(dbName);
    return await attemptModel.find({questionID: questionID});
  },
  getAttemptsDetailsFromCookieID: async (cookieID, dbName) => {
    const attemptModel = await getAttemptModel(dbName);
    return await attemptModel.find({cookieID: cookieID});
  },
} 

export default attemptRepo;
