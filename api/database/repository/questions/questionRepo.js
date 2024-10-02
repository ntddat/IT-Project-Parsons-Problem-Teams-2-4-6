import QuestionSchema from "../../model/questions/questionModel.js";
import { getDatabaseConnection } from "../../connection.js";
import dotenv from 'dotenv'
dotenv.config();


const getQuestionModel = async (dbName) => {
  const questionCollection = process.env.QUESTION_DETAILS_COLLECTION;
  if (!questionCollection) {
    throw new Error("Question collection is not defined in env file");
  }
  const dbConnection = await getDatabaseConnection(dbName);
  return dbConnection.model(questionCollection, QuestionSchema);
}

// Contains all methods communicating with the question collection
const questionRepo = {
  // -------------------------------------FOR USER ANALYTICS-------------------------------------
  // Finds and returns the question with this questionID
  getQuestionDetailsFromArray: async (questionIDArray, dbName) => {
    try {
      const questionModel = await getQuestionModel(dbName);
      return await questionModel.find({
        questionID: { $in: questionIDArray },
      });
    } catch (e) {
      console.error("Error getting question details:", e);
      throw e;
    }
  },

  // -------------------------------------UPDATES-------------------------------------

  generateNewQuestionID: async (dbName) => {
    try {
      const questionModel = await getQuestionModel(dbName);
      const numQuestions = await questionModel.countDocuments();
      return numQuestions + 1;
    } catch (e) {
      console.error("Error generating new question ID:", e);
      throw e;
    }
  },

  createNewQuestion: async (questionID, topic, context, dbName) => {
    const questionModel = await getQuestionModel(dbName);
    const newQuestion = new questionModel({
      questionID: questionID,
      topic: topic,
      context: context,
    });
    try {
      return await newQuestion.save();
    } catch (e) {
      console.error("Error saving the question:", e);
      throw e;
    }
  },

  // Updates the details of the question with this questionID
  updateQuestionDetails: async (questionID, time, correct, dbName) => {
    try {
      const questionModel = await getQuestionModel(dbName);
      // Only updates the fields that are present in updatedDetails
      return await questionModel.updateOne(
        { questionID: questionID },
        { 
          $inc: {
            numAttempts: 1,
            totalTime: time,
          }, 
          $set: {
            correct: correct,
            // averageTime: {
            //   $cond: [
            //     { $eq: ["$numAttempts", 0] }, 0,
            //     { $round: [{ $divide: ["$totalTime", "$numAttempts"] }] } // else, average time is total time / total attempts, in seconds maybe
            //   ]
            // }
          }
        }
      );
    } catch (e) {
      console.error("Error updating question details:", e);
      throw e;
    }
  },
}

export default questionRepo;