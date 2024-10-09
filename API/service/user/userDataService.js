import userDataRepo from "../../database/repository/user/userDataRepo.js";
import questionRepo from "../../database/repository/questions/questionRepo.js";
import { topicsList } from "../../utils/constants/TopicsContexts.js";

const userDataService = {
  newUserID: async (usersDbName) => {
    try {
      const userID = await userDataRepo.newUserID(usersDbName);
      const newUser = await userDataRepo.createUser(userID, topicsList, usersDbName);
      if (!userID || !newUser) {
        return {
          success: false,
          message: "Error generating new user ID and new user",
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

  changeUsername: async (userID, newUsername, usersDbName) => {
    try {
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

  getUserData: async (userID, usersDbName) => {
    try {
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
        userData: userData,
      };
    } catch (e) {
      console.error("Error getting user details:", e);
      return {
        success: false,
        message: "Error getting user details",
        userData: {},
      };
    }
  },

  addQuestionDetailsToUserData: async (userData, questionsDbName) => {
    try {
      // squash everything into a giant list of questionIDs
      const allQuestionIDs = userData.attemptsSummary.reduce((acc, topic) => {
        return acc.concat(topic.attemptedQuestions.map(question => question.questionID));
      }, []); // accumulate all question IDs into this empty array

      const questionDetails = await questionRepo.getQuestionDetailsFromArray(allQuestionIDs, questionsDbName); // fetch everything

      const questionDetailsMap = questionDetails.reduce((acc, question) => {
        acc[question.questionID] = question;
        return acc;
      }, {}); // convert the array into a map for faster lookup
      
      // merge everything together
      const enrichedUserData = {
        ...userData,
        attemptsSummary: userData.attemptsSummary.map(topic => ({
          ...topic,
          attemptedQuestions: topic.attemptedQuestions.map(question => ({
            questionID: question.questionID,
            details: questionDetailsMap[question.questionID] || {}, // if the question doesn't exist, return an empty object
          }))
        }))
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

  updateUserAnalytics: async (userID, topic, correct, time, questionID, usersDbName) => {
    try {
      const result = await userDataRepo.updateUserAnalytics(userID, topic, correct, time, questionID, usersDbName);
      console.log('Result of updateUserAnalytics:', result);
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