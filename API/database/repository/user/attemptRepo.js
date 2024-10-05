import { getDatabaseConnection } from "../../connection.js";
import AttemptSchema from "../../model/user/attemptModel.js";
import dotenv from 'dotenv';
dotenv.config();

const getAttemptModel = async (dbName) => {
  const attemptCollection = process.env.ATTEMPT_COLLECTION;
  if (!attemptCollection) {
    throw new Error("Attempt collection is not defined in env file");
  }
  const dbConnection = await getDatabaseConnection(dbName);
  return dbConnection.model(attemptCollection, AttemptSchema);
}

const attemptRepo = {
  //-------------------------------------FOR ADMIN ANALYTICS-------------------------------------
  // Counts total number of attempts
  getTotalNumAttempts: async (dbName) => {
    try {
      const attemptModel = await getAttemptModel(dbName);
      return await attemptModel.countDocuments();
    } catch (e) {
      console.error("Error getting total number of attempts:", e);
      throw e;
    }
  },

  // // Uses the mongodb aggregation pipeline to get the average time spent on an attempt
  // // TODO: decide if we need total time or average time for admin, and whether its for questions or attempts
  // getAverageTime: async (dbName) => {
  //   try {
  //     const attemptModel = await getAttemptModel(dbName);
  //     const result = await attemptModel.aggregate([{
  //         $group: {
  //           _id: null,
  //           averageTime: { $avg: "$time" }
  //         }
  //       }
  //     ]);
  //     const averageTime = result.length > 0 ? result[0].averageTime : 0;
  //     return averageTime;
  //   } catch (e) {
  //     console.error("Error calculating average time:", e);
  //     throw e;
  //   }
  // },

  // // TODO: decide if we need total time or average time for admin
  // getTotalTime: async (dbName) => {
  //   try {
  //     const attemptModel = await getAttemptModel(dbName);
  //     const result = await attemptModel.aggregate([{
  //       $group: {
  //         _id: null,
  //         totalTime: { $sum: "$time" }
  //       }
  //     }]);
  //     const totalTime = result.length > 0 ? result[0].totalTime : 0;
  //     return totalTime;
  //   } catch (e) {
  //     console.error("Error calculating total time:", e);
  //     throw e;
  //   }
  // },

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
            numAttempts: { $sum: 1 },
          }
        }
      ]);
      // calculate accuracy as a percentage
      const accuracy = result.length > 0 
        ? Math.round((result[0].correctAttempts / result[0].numAttempts) * 100) 
        : 0;
      return accuracy;
    } catch (e) {
      console.error("Error calculating total accuracy:", e);
      throw e;
    }
  },

  /**
   * Uses the mongodb aggregation pipeline to get the data for all topics
   * [ {
   *  topic: "abcxyz",
   * `numAttempts: 90,
   *  accuracy: 79
   * },... ]
   */
  getTopicsAnalytics: async (dbName) => {
    try {
      const attemptModel = await getAttemptModel(dbName);
      const result = await attemptModel.aggregate([{
          $group: {
            // group attempts by topic
            _id: "$topic",
            numAttempts: { $sum: 1 }, // num of documents
            // totalTime: { $sum: "$time" }, // sum of time
            correctAttempts: {
              $sum: {
                $cond: [{ $eq: ["$correct", true] }, 1, 0] // counts how many correct attempts there are
              }
            }
          }
        },
        {
          // project is what we want to show / return, here: topic, numAttempts, averageTime, accuracy
          $project: {
            topic: "$_id",
            numAttempts: 1,
            // averageTime: { 
            //   $cond: [
            //     { $eq: ["$numAttempts", 0] }, 0, // if no attempts, average time is 0
            //     { $round: [{ $divide: ["$totalTime", "$numAttempts"] }] } // else, average time is total time / total attempts, in seconds maybe
            //   ]
            // },
            accuracy: {
              $cond: [
                { $eq: ["$numAttempts", 0] }, 0,
                { $round: [{$multiply: [{ $divide: ["$correctAttempts", "$numAttempts"] }, 100] }]} // percentage
              ]
            }
          }
        }
      ])
      return result;
    } catch (e) {
      console.error("Error getting topics analytics:", e);
      throw e;
    }
  },

  // -------------------------------------UPDATES-------------------------------------
  saveAttempt: async (attempt, dbName) => {
    try {
      const attemptModel = await getAttemptModel(dbName);
      const attemptsCount = await questionModel.countDocuments();
      const approvedAttempt = new attemptModel({
        attemptID: attemptsCount + 1,
        ...attempt,
      });
      return await approvedAttempt.save();
    } catch (e) {
      console.error("Error saving attempt:", e);
      throw e;
    }
  }
} 

export default attemptRepo;
