import { QuestionDetailsSchema } from "../../models/questionDetailsModel.js";
import { getDatabaseConnection } from "../../index.js";
import { messages } from "../../utils/constants/messages.js";
require('dotenv').config();


const getQuestionDetailsModel = (dbName) => {
  const questionDetailsCollection = process.env.QUESTION_DETAILS_COLLECTION;
  if (!questionDetailsCollection) {
    throw new Error(messages.QUESTION_DETAILS_COLLECTION_UNDEFINED);
  }
  const dbConnection = getDatabaseConnection(dbName);
  return dbConnection.model(questionDetailsCollection, QuestionDetailsSchema);
}

// Contains all methods communicating with the questionDetails collection
export const questionDetailsRepo = {
  // Finds and returns the question with this questionID
  getQuestionDetails: async (questionID, dbName) => {
    const questionDetailsModel = getQuestionDetailsModel(dbName);
    return await questionDetailsModel.findOne({
      questionID: questionID,
    });
  },

  // Updates the details of the question with this questionID
  updateQuestionDetails: async (questionID, updatedDetails, dbName) => {
    const questionDetailsModel = getQuestionDetailsModel(dbName);
    return await questionDetailsModel.updateOne(
      { questionID: questionID }, 
      updatedDetails,
    );
  },

  // Saves a new question to the collection
  saveApprovedQuestion: async (questionDetails, dbName) => {
    const questionDetailsModel = getQuestionDetailsModel(dbName);
    const approvedQuestion = new questionDetailsModel(questionDetails);
    try {
      return await approvedQuestion.save();
    } catch (e) {
      console.error("Error saving the question:", e);
    }
  },

  // Deletes a question from the collection
  deleteQuestion: async (questionID, dbName) => {
    const questionDetailsModel = getQuestionDetailsModel(dbName);
    return await questionDetailsModel.deleteOne({
      questionID: questionID,
    });
  }
}