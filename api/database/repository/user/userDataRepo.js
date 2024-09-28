import dotenv from 'dotenv';
import { getDatabaseConnection } from '../../connection.js';
import messages from '../../../utils/constants/messages.js';
import UserDataSchema from '../../model/user/userDataModel.js';

dotenv.config();

const getUserDataModel = async (dbName) => {
  const userDataCollection = process.env.USER_DATA_COLLECTION;
  if (!userDataCollection) {
    throw new Error(messages.USER_COLLECTION_UNDEFINED);
  }
  const dbConnection = await getDatabaseConnection(dbName);
  return dbConnection.model(userDataCollection, UserDataSchema);
}

const userDataRepo = {
  getUserAnalytics: async (cookieID, dbName) => {
    const userDataModel = await getUserDataModel(dbName);
    return await userDataModel.findOne({cookieID: cookieID});
  },

  getTop5RecentQuestions: async (cookieID, topic, dbName) => {
    try {
      const userDataModel = await getUserDataModel(dbName);
      // returns the list of the 5 most recent questions the user has attempted for every topic
      const result = await userDataModel.aggregate([
        {
          $match: {
            cookieID: cookieID,
          }
        },
        {
          $unwind: "$attemptsSummary"
        },
        {
          $project: {
            topic: "$attemptsSummary.topic",
            top5recent: {
              $slice: ["$attemptsSummary.questions", -5] // return up to 5 most recent questions
            }
          }
        }
      ]);
      return result;
    } catch (e) {
      console.error("Error getting top 5 recent questions:", e);
      throw e;
    }
  },

  //-------------------------------------FOR ADMIN ANALYTICS-------------------------------------

  // Uses the mongodb aggregation pipeline to get the data for all users according to topic
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
            averageTime: "$attemptsSummary.averageTime"
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
}

export default userDataRepo;