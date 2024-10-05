import dotenv from 'dotenv';
import { getDatabaseConnection } from '../../connection.js';
import UserDataSchema from '../../model/user/userDataModel.js';

dotenv.config();

const getUserDataModel = async (dbName) => {
  const userDataCollection = process.env.USER_DATA_COLLECTION;
  if (!userDataCollection) {
    throw new Error("User data collection is not defined in env file");
  }
  const dbConnection = await getDatabaseConnection(dbName);
  return dbConnection.model(userDataCollection, UserDataSchema);
}

const userDataRepo = {
  // -------------------------------------FOR USER ANALYTICS-------------------------------------
  getUserData: async (cookieID, dbName) => {
    try {
      const userDataModel = await getUserDataModel(dbName);
      const result = await userDataModel.aggregate([
        { $match: { cookieID: cookieID } },
        {
          $project: {
            _id: 0,
            cookieID: 1,
            accuracy: 1,
            numAttempts: 1,
            attemptsSummary: {
              $map: {
                input: "$attemptsSummary",
                as: "summary",
                in: {
                  topic: "$$summary.topic",
                  numAttempts: "$$summary.numAttempts",
                  accuracy: "$$summary.accuracy",
                  attemptedQuestions: {
                    $slice: ["$$summary.attemptedQuestions", -5] // return up to 5 most recent questions
                  },
                }
              }
            }
          }
        }
      ]);
      return result[0];
    } catch (e) {
      console.error("Error getting user data:", e);
      throw e;
    }
  },

  //-------------------------------------FOR ADMIN ANALYTICS-------------------------------------

  /**
   * Uses the mongodb aggregation pipeline to get the data for all users according to topic
   * @param {string} topic
   * @returns an array of Objects. For example, for topic DataFrame, there are users 1234, 1235, 1236 who has attempted: 
   * [
    * {
    *  cookieID: 1234,
    *  numAttempts: 10,
    *  accuracy: 80,
    *  totalTime: 80,
    * }, 
   * .....
   * ]
   */
  getUserSummaryOfTopic: async (topic, dbName) => {
    try {
      const userDataModel = await getUserDataModel(dbName);
      const result = await userDataModel.aggregate([
        {
          // splits the attemptsSummary array into separate documents
          $unwind: "$attemptsSummary"
        },
        {
          $match: {
            // user's topic matches what is given
            "attemptsSummary.topic": topic,
            "attemptsSummary.numAttempts": { $gt: 0 } // greater than 0 (they have attempted at least one question)
          }
        },
        {
          $project: {
            cookieID: 1,
            numAttempts: "$attemptsSummary.numAttempts",
            accuracy: "$attemptsSummary.accuracy",
            totalTime: "$attemptsSummary.totalTime",
          }
        },
        {
          // sort so the top users are at the top
          $sort: { "attemptsSummary.numAttempts": -1 }
        }
      ])
      return result;
    } catch (e) {
      console.error("Error getting user summary of topic:", e);
      throw e;
    }
  },

  // -------------------------------------UPDATES-------------------------------------
  updateUserAnalytics: async (cookieID, topic, correct, time, questionID, dbName) => {
    try {
      const userDataModel = await getUserDataModel(dbName);
      return await userDataModel.updateOne(
        { cookieID: cookieID },
        {
          $inc: {
            numAttempts: 1,
            numCorrect: correct ? 1 : 0,
            "$attemptsSummary.$[element].numAttempts": 1,
            "$attemptsSummary.$[element].numCorrect": correct ? 1 : 0,
            "$attemptsSummary.$[element].totalTime": time,
          },
          $set: {
            accuracy: {
              $cond: [
                { $eq: ["$numAttempts", 0] }, 0,
                { $round: [{$multiply: [{ $divide: ["$numCorrect", "$numAttempts"] }, 100] }]} // percentage
              ]
            },
            "$attemptsSummary.$[element].accuracy": {
              $cond: [
                { $eq: ["$attemptsSummary.$[element].numAttempts", 0] }, 0,
                { $round: [{$multiply: [{ $divide: ["$attemptsSummary.$[element].numCorrect", "$attemptsSummary.$[element].numAttempts"] }, 100] }]} // percentage
              ]
            }
          },
          $push: {
            "$attemptsSummary.$[element].attemptedQuestions": { questionID: questionID }
          },
        },
        {
          arrayFilters: [
            // the element has to have the same topic as the one we are updating
            {
              "element.topic": topic
            }
          ]
        }
      );
    } catch (e) {
      console.error("Error updating user data:", e);
      throw e;
    }
  },
}

export default userDataRepo;