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

  getAttemptsDetailsFromCookieIDByTopic: async (cookieID, topic, dbName) => {
    const attemptModel = await getAttemptModel(dbName);
    return await attemptModel.find({cookieID: cookieID, topic: topic});
  },

  //-------------------------------------FOR ADMIN ANALYTICS-------------------------------------

  // Counts total number of attempts
  getTotalNumAttempts: async (dbName) => {
    try {
      const attemptModel = await getAttemptModel(dbName);
      return await attemptModel.countDocuments();
    } catch (e) {
      console.error("Error getting total number of attempts:", e);
    }
  },

  // Uses the mongodb aggregation pipeline to get the average time spent on a question
  getAverageTime: async (dbName) => {
    try {
      const attemptModel = await getAttemptModel(dbName);
      const result = await attemptModel.aggregate([{
          $group: {
            _id: null,
            averageTime: { $avg: "$time" }
          }
        }
      ]);
      const averageTime = result.length > 0 ? result[0].averageTime : 0;
      return averageTime;
    } catch (e) {
      console.error("Error calculating average time:", e);
    }
  },

  // Uses the mongodb aggregation pipeline to get the accuracy of all attempts
  getTotalAccuracy: async (dbName) => {
    try {
      const attemptModel = await getAttemptModel(dbName);
      const result = await attemptModel.aggregate([{
          $group: {
            _id: null,
            correctAttempts: { 
              $sum: { 
                $cond: { 
                  if: "$correct", then: 1, else: 0 
                } 
              } 
            },
            totalAttempts: { $sum: 1 },
          }
        }
      ]);
      // calculate accuracy as a percentage
      const accuracy = result.length > 0 
        ? Math.round((result[0].correctAttempts / result[0].totalAttempts) * 100) 
        : 0;
      return accuracy;
    } catch (e) {
      console.error("Error calculating total accuracy:", e);
    }
  },

  // Returns an array of total attempts, average time, and accuracy of each topic
  getTopicsAnalytics: async (dbName) => {
    try {
      attemptModel = await getAttemptModel(dbName);
      const result = await attemptModel.aggregate([{
          $group: {
            _id: "$topic",
            totalAttempts: { $sum: 1 },
            totalTime: { $sum: "$time" },
            correctAttempts: {
              $sum: {
                $cond: [{ $eq: ["$correct", true] }, 1, 0]
              }
            }
          }
        },
        {
          $project: {
            topic: "$_id",
            totalAttempts: 1,
            averageTime: { $divide: ["$totalTime", "$totalAttempts"] },
            accuracy: {
              $multiply: [{ $divide: ["$correctAttempts", "$totalAttempts"] }, 100] // percentage
            }
          }
        }
      ])
      return result;
    } catch (e) {
      console.error("Error getting topics analytics:", e);
    }
  },
} 

export default attemptRepo;
