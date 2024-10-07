import dotenv from 'dotenv';
import { getDatabaseConnection } from '../../connection.js';
import UserDataSchema from '../../model/user/userDataModel.js';

dotenv.config();

const getUserDataModel = async (usersDbName) => {
  const userDataCollection = process.env.USER_DATA_COLLECTION;
  if (!userDataCollection) {
    throw new Error("User data collection is not defined in env file");
  }
  const dbConnection = await getDatabaseConnection(usersDbName);
  return dbConnection.model(userDataCollection, UserDataSchema);
}

const userDataRepo = {
  // -------------------------------------FOR USER ANALYTICS-------------------------------------
  getUserData: async (userID, usersDbName) => {
    try {
      const userDataModel = await getUserDataModel(usersDbName);
      const result = await userDataModel.aggregate([
        { $match: { userID: userID } },
        {
          $project: {
            _id: 0,
            userID: 1,
            name: 1,
            accuracy: 1,
            numQuestions: 1,
            topicSummary: {
              $map: {
                input: "$topicSummary",
                as: "summary",
                in: {
                  topic: "$$summary.topic",
                  numQuestions: "$$summary.numQuestions",
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
  getUserSummaryOfTopic: async (topic, usersDbName) => {
    try {
      const userDataModel = await getUserDataModel(usersDbName);
      const result = await userDataModel.aggregtae([
        {
          // splits the attemptsSummary array into separate documents
          $unwind: "$topicSummary"
        },
        {
          $match: {
            // user's topic matches what is given
            "topicSummary.topic": topic,
            "topicSummary.numQuestions": { $gt: 0 } // greater than 0 (they have attempted at least one question)
          }
        },
        {
          $project: {
            userID: 1,
            numQuestions: "$topicSummary.numQuestions",
            accuracy: "$topicSummary.accuracy",
            totalTime: "$topicSummary.totalTime",
          }
        },
        {
          // sort so the top users are at the top
          $sort: { "topicSummary.numQuestions": -1 }
        }
      ])
      return result;
    } catch (e) {
      console.error("Error getting user summary of topic:", e);
      throw e;
    }
  },

  // -------------------------------------UPDATES-------------------------------------
  newUserID: async (usersDbName) => {
    try {
      const userDataModel = await getUserDataModel(usersDbName);
      const result = await userDataModel.countDocuments();
      return result + 1;
    } catch (e) {
      console.error("Error getting new user ID:", e);
      throw e;
    }
  },

  changeUsername: async (userID, newUsername, usersDbName) => {
    try {
      const userDataModel = await getUserDataModel(usersDbName);
      return await userDataModel.updateOne(
        { userID: userID },
        { name: newUsername }
      );
    } catch (e) {
      console.error("Error changing username:", e);
      throw e;
    }
  },

  updateUserAnalytics: async (userID, topic, correct, time, questionID, usersDbName) => {
    try {
      const userDataModel = await getUserDataModel(usersDbName);
      return await userDataModel.updateOne(
        { userID: userID },
        [
          {
            $set: {
              topicSummary: {
                $map: {
                  input: "$topicSummary",
                  as: "summary",
                  in: {
                    $cond: {
                      if: { $eq: ["$$summary.topic", topic] },
                      then: {
                        topic: "$$summary.topic",
                        attemptedQuestions: {
                          $addToSet: { questionID: questionID } // Adding to set for attemptedQuestions
                        },
                        correctQuestions: {
                          $cond: {
                            if: { $eq: [correct, true] },
                            then: { $addToSet: { questionID: questionID } }, // add only if correct
                            else: "$$REMOVE" // dont add
                          }
                        },
                        totalTime: { $add: ["$$summary.totalTime", time] },
                        numCorrect: { $size: "$$summary.correctQuestions" },
                        numQuestions: { $size: "$$summary.attemptedQuestions" },
                        accuracy: {
                          $cond: [
                            { $eq: [{ $size: "$$summary.attemptedQuestions" }, 0] }, 0,
                            { $round: [{$multiply: [{ $divide: [
                              { $size: "$$summary.correctQuestions" }, { $size: "$$summary.attemptedQuestions" }
                            ] }, 100] }]} // percentage
                          ]
                        }
                      },
                      else: "$$summary" // return the original document
                    }
                  }
                }
              },
              numQuestions: {
                $reduce: {
                  input: "$topicSummary",
                  initialValue: 0,
                  in: { $add: ["$$value", "$$this.numQuestions"] } // Sum all numQuestions in each topic
                }
              },
              accuracy: {
                $cond: [
                  { $eq: ["$numQuestions", 0] }, 0, // if no questions, accuracy is 0
                  { $round: [{$multiply: [{ $divide: [
                    {$reduce: {
                      input: "$topicSummary",
                      initialValue: 0,
                      in: { $add: ["$$value", "$$this.numCorrect"] } // Sum all numCorrect in each topic
                    }}, 
                    {$reduce: {
                      input: "$topicSummary",
                      initialValue: 0,
                      in: { $add: ["$$value", "$$this.numQuestions"] } // Sum all numQuestions in each topic
                    }}
                  ] }, 100] }]} // percentage
                ]
              }
            }
          }
        ]
      );
    } catch (e) {
      console.error("Error updating user data:", e);
      throw e;
    }
  },
}

export default userDataRepo;