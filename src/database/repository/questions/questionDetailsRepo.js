import { QuestionDetailsSchema } from "../../models/questionDetailsSchema";
import { getDatabaseConnection } from "../../index.js";
import { messages } from "../../utils/constants/messages";
require ('dotenv').config();

export const getQuestionDetails = async (questionID, dbName) => {
  const questionDetailsCollection = process.env.QUESTION_DETAILS_COLLECTION;
  if (!questionDetailsCollection) {
    throw new Error(messages.QUESTION_DETAILS_COLLECTION_UNDEFINED);
  }
  const dbConnection = getDatabaseConnection(dbName);
  const questionDetailsModel = dbConnection.model(
    questionDetailsCollection,
    QuestionDetailsSchema
  );

  return await questionDetailsModel.findOne({
    questionID: questionID,
  });
}