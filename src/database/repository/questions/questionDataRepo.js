import { QuestionDataSchema } from "../../models/questions/questionDataModel";
import { getDatabaseConnection } from "../../index.js";

export const getQuestionData = async (questionID, dbName) => {
  const questionDataCollection = process.env.QUESTION_DATA_COLLECTION;
  if (!questionDataCollection) {
    throw new Error(stringConstants.QUESTION_DATA_COLLECTION_UNDEFINED);
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