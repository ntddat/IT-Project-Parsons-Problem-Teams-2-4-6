import { QuestionDataSchema } from "../../models/questions/questionDataModel.js";
import { getDatabaseConnection } from "../../index.js";
import { messages } from "../../utils/constants/messages.js";
require('dotenv').config();

export const getQuestionData = async (questionID, dbName) => {
  const questionDataCollection = process.env.QUESTION_DATA_COLLECTION;
  if (!questionDataCollection) {
    throw new Error(messages.QUESTION_DATA_COLLECTION_UNDEFINED);
  }
  const dbConnection = getDatabaseConnection(dbName);
  const questionDataModel = dbConnection.model(
    questionDataCollection,
    QuestionDataSchema
  );

  return await questionDataModel.findOne({
    questionID: questionID,
  });
}