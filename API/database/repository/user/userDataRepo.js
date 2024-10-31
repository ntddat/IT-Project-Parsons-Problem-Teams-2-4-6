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
  // Get the user data of the user with the given userID
  getUserData: async (userID, usersDbName) => {
    try {
      const userDataModel = await getUserDataModel(usersDbName);
      
      const result = await userDataModel.aggregate([
        // match the user with the given userID
        { $match: { userID: userID } },
        {
          $project: {
            _id: 0, // exclude the _id field
            // include the following fields
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
      return result[0]; // aggregate returns an array, so return the first element
    } catch (e) {
      console.error("Error getting user data:", e);
      throw e;
    }
  },

  //-------------------------------------FOR ADMIN ANALYTICS-------------------------------------
  // Get the summary of all users' data
  getUserSummaryOfTopic: async (usersDbName) => {
    try {
      const userDataModel = await getUserDataModel(usersDbName);

      const result = await userDataModel.aggregate([
        { $match: { userID: { $ne: 1 } } }, // Exclude the control user
        { $unwind: "$topicSummary" }, // unwinds the array into individual documents, one for each topic for each user
        {
          $group: {
            _id: "$topicSummary.topic", // group by topic
            // for each topic:
            numQuestions: { $sum: "$topicSummary.numQuestions" }, // sum up numQuestions of the topic from ALL USERS
            numCorrect: { $sum: "$topicSummary.numCorrect" }, // sum up numCorrect of the topic from ALL USERS
            // set up a list of users with their userID, accuracy, numQuestions, numCorrect, totalTime, for the topic
            users: {
              // se
              $push: {
                userID: "$userID",
                accuracy: "$topicSummary.accuracy",
                numQuestions: "$topicSummary.numQuestions",
                numCorrect: "$topicSummary.numCorrect",
                totalTime: "$topicSummary.totalTime",
              }
            }
          }
        },
        {
          $project: {
            topic: "$_id", // show the topic
            numQuestions: 1, // show the total number of questions in the topic
            numCorrect: 1, // show the total number of correct questions in the topic
            accuracy: {
              $cond: [
                { $eq: ["$numQuestions", 0] }, 0,
                { $round: [{$multiply: [{ $divide: ["$numCorrect", "$numQuestions"] }, 100] }, 2]}
              ]
            }, // calculate the overall accuracy of the topic based on number of correct questions answered
            users: {
              $filter: {
                input: "$users",
                as: "user",
                cond: { $gt: ["$$user.numQuestions", 0] } // user must have attempted at least 1 question in the topic
              }
            }
          }
        },
        {
          $addFields: {
            users: {
              $sortArray: {
                input: "$users",
                sortBy: { numQuestions: -1 } // sort users by numQuestions in descending order
              }
            }
          }
        },
      ]);
      return result;
    } catch (e) {
      console.error("Error getting user summary of topic:", e);
      throw e;
    }
  },

  // -------------------------------------UPDATES-------------------------------------
  // returns a new userID (number of users + 1)
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

  // creates a new user with the given userID and topicsList
  createUser: async (userID, topicsList, usersDbName) => {
    try {
      const userDataModel = await getUserDataModel(usersDbName);
      // for each topic, make fresh analytics
      const topicSummary = topicsList.map(topic => ({
        topic: topic,  // String value for the topic
        numQuestions: 0,
        numCorrect: 0,
        accuracy: 0,
        totalTime: 0,
        attemptedQuestions: [],
        correctQuestions: []
      }));
  
      // create a new user with the given userID and fresh analytics
      const newUser = new userDataModel({
        userID: userID,
        topicSummary: topicSummary,
      });
      // save the new user into the database
      return await newUser.save();
    } catch (e) {
      console.error("Error creating user:", e);
      throw e;
    }
  },

  // changes the username of the user with the given userID
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

  // updates the user analytics after answering a question
  updateUserAnalytics: async (userID, topic, correct, time, questionID, usersDbName) => {
    try {
      const userDataModel = await getUserDataModel(usersDbName);
      // First update: save the attempted question into the question SET (unique) of the topic
      await userDataModel.updateOne(
        // Find the user with the given userID
        { userID: userID },
        // Adds the questionID to the attemptedQuestions array of the topic. Using addtoset to ensure UNIQUE values
        {
          $addToSet: {
            "topicSummary.$[element].attemptedQuestions": questionID,
          },
          // Increase the total time and the time for the topic
          $inc: {
            totalTime: time,
            "topicSummary.$[element].totalTime": time,
          },
        },
        {
          arrayFilters: [
            {
              "element.topic": topic
            }
          ]
        }
      );

      if (correct) {
        await userDataModel.updateOne(
          // Find the user with the given userID
          { userID: userID },
          // Adds the questionID to the correctQuestions array of the topic. Using addtoset to ensure UNIQUE values
          {
            $addToSet: {
              "topicSummary.$[element].correctQuestions": questionID,
            },
          },
          {
            arrayFilters: [
              {
                "element.topic": topic
              }
            ]
          }
        );
      }

      // This step is not included in the first two updateOne operations because the steps NOT GUARANTEED to be sequential.
      // If the first two operations are done in parallel, the updated topicSummary may not be accurate.
      const updatedTopic = await userDataModel.findOne(
        { userID: userID, "topicSummary.topic": topic },
        { "topicSummary.$": 1 }
      ); // shows the updated topicSummary for that topic ONLY

      const selectedTopic = updatedTopic.topicSummary[0];
      const numQuestionsTopic = selectedTopic.attemptedQuestions.length;
      const numCorrectTopic = selectedTopic.correctQuestions.length;
      const accuracyTopic = numQuestionsTopic === 0 ? 0 : Math.round((numCorrectTopic / numQuestionsTopic) * 100 * 100) / 100;

      // Second update: update the number of questions and correct in the topic
      await userDataModel.updateOne(
        { userID: userID },
        {
          // Update the number of questions, correct, and accuracy of the topic
          $set: {
            "topicSummary.$[element].numQuestions": numQuestionsTopic,
            "topicSummary.$[element].numCorrect": numCorrectTopic,
            "topicSummary.$[element].accuracy": accuracyTopic,
          }
        },
        {
          arrayFilters: [
            {
              "element.topic": topic
            }
          ]
        }
      );

      const updatedUser = await userDataModel.findOne({ userID: userID });
      let totalNumQuestions = 0;
      let totalNumCorrect = 0;

      updatedUser.topicSummary.forEach((topic) => {
        totalNumQuestions += topic.numQuestions || 0; // Ensure `numQuestions` is defined
        totalNumCorrect += topic.numCorrect || 0;     // Ensure `numCorrect` is defined
      });

      const overallAccuracy = totalNumQuestions === 0 ? 0 
        : Math.round((totalNumCorrect / totalNumQuestions) * 100 * 100) / 100; // Rounded to 2 decimal places

      // Third update: update the total number of questions and correct in the user's data, and accuracy of the topic and the overall user
      return await userDataModel.updateOne(
        { userID: userID },
        {
          $set: {
            numQuestions: totalNumQuestions,
            accuracy: overallAccuracy,
          },
        },
        {
          arrayFilters: [
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