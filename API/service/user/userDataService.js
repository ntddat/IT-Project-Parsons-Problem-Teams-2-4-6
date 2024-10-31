import userDataRepo from "../../database/repository/user/userDataRepo.js";
import questionRepo from "../../database/repository/questions/questionRepo.js";
import { topicsList } from "../../utils/constants/TopicsContexts.js";

const userDataService = {
  /**
   * @param {*} usersDbName: the name of the database containing the user_data collection
   * @returns a new user ID
   */
  newUserID: async (usersDbName) => {
    try {
      // generate a new user ID
      const userID = await userDataRepo.newUserID(usersDbName);
      if (!userID) {
        return {
          success: false,
          message: "Error generating new user ID",
        };
      }
      // create a new user with the new user ID with fresh analytics, using the topicsList in TopicsContexts.js
      const newUser = await userDataRepo.createUser(userID, topicsList, usersDbName);
      if (!newUser) {
        return {
          success: false,
          message: "Error saving new user",
        };
      }

      return {
        success: true,
        message: "New user ID generated successfully",
        userID: userID,
      };
    } catch (e) {
      console.error("Error generating new user ID:", e);
      return {
        success: false,
        message: e.message,
      };
    }
  },

  /**
   * @param {*} userID: the ID of the user
   * @param {*} newUsername: the new username to change to
   * @param {*} usersDbName: the name of the database containing the user_data collection
   * @returns true if the username was changed successfully, false otherwise
   */
  changeUsername: async (userID, newUsername, usersDbName) => {
    try {
      // change username for the user
      const result = await userDataRepo.changeUsername(userID, newUsername, usersDbName);
      if (!result.acknowledged) {
        return {
          success: false,
          message: "Error changing username",
        };
      }
      return {
        success: true,
        message: "Username changed successfully",
      };
    } catch (e) {
      console.error("Error changing username:", e);
      return {
        success: false,
        message: e.message,
      };
    }
  },

  /**
   * @param {*} userID: the ID of the user
   * @param {*} usersDbName: the name of the database containing the user_data collection
   * @returns the user data if found, or an error message if not
   */
  getUserData: async (userID, usersDbName) => {
    try {
      // get the user data
      const user = await userDataRepo.getUserData(userID, usersDbName);
      if (!user) {
        return {
          success: false,
          message: "Cannot find user",
          userData: {},
        };
      }
      return {
        success: true,
        message: "User data retrieved successfully",
        userData: user,
      };
    } catch (e) {
      console.error("Error getting user details:", e);
      return {
        success: false,
        message: "Error getting user details",
      };
    }
  },

  /**
   * @param {*} userData: the user data to enrich with question details
   * @param {*} questionsDbName: the name of the database containing the questions_details collection
   * @returns the user data enriched with question details if successful, or an error message if not
   */
  addQuestionDetailsToUserData: async (userData, questionsDbName) => {
    try {
      // squash everything into a giant list of questionIDs
      const allQuestionIDs = userData.topicSummary.reduce((acc, topic) => {
        return acc.concat(topic.attemptedQuestions.map(question => question));
      }, []); // accumulate all question IDs into this empty array

      const questionDetails = await questionRepo.getQuestionDetailsFromArray(allQuestionIDs, questionsDbName); // fetch everything

      const questionDetailsMap = questionDetails.reduce((acc, question) => {
        acc[question.questionID] = question;
        return acc;
      }, {}); // convert the array into a map for faster lookup
      
      // merge everything together
      const enrichedUserData = {
        ...userData,
        topicSummary: userData.topicSummary.map(topic => ({
          ...topic,
          attemptedQuestions: topic.attemptedQuestions.map(question => (
            (questionDetailsMap[question]) ? questionDetailsMap[question] : {}  // if the question doesn't exist, return an empty object))
          )),
        }), ),
      };
      return {
        success: true,
        message: "User data enriched successfully",
        userData: enrichedUserData,
      };
    } catch (e) {
      console.error('Error loading question details:', e);
      return {
        success: false,
        message: 'Error loading question details',
      };
    }
  },

  /**
   * @param {*} userID: the ID of the user
   * @param {*} topic: the topic of the question
   * @param {*} correct: whether the ATTEMPT was correct
   * @param {*} time: the amount of time of the ATTEMPT
   * @param {*} questionID: the ID of the question
   * @param {*} usersDbName: the name of the database containing the user_data collection
   * @returns a successful message if the user analytics were updated successfully, or an error message if not
   */
  updateUserAnalytics: async (userID, topic, correct, time, questionID, usersDbName) => {
    try {
      const result = await userDataRepo.updateUserAnalytics(userID, topic, correct, time, questionID, usersDbName);
      if (!result.acknowledged) {
        return {
          success: false,
          message: "Error updating user analytics",
        };
      }

      return {
        success: true,
        message: "User analytics updated successfully",
        result: result,
      };
    } catch (e) {
      console.error("Error updating user analytics:", e);
      return {
        success: false,
        message: "Error updating user analytics",
      };
    }
  }
}

export default userDataService;