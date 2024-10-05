import userDataRepo from "../../database/repository/user/userDataRepo.js";
import questionRepo from "../../database/repository/questions/questionRepo.js";

const userDataService = {
  getUserData: async (cookieID, dbName) => {
    try {
      const user = await userDataRepo.getUserData(cookieID, dbName);
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

  addQuestionDetailsToUserData: async (userData, dbName) => {
    try {
      // squash everything into a giant list of questionIDs
      const allQuestionIDs = userData.attemptsSummary.reduce((acc, topic) => {
        return acc.concat(topic.attemptedQuestions.map(question => question.questionID));
      }, []); // accumulate all question IDs into this empty array

      const questionDetails = await questionRepo.getQuestionDetailsFromArray(allQuestionIDs, dbName); // fetch everything

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

  updateUserAnalytics: async (cookieID, analytics, dbName) => {
    try {
      const { topic, correct, time, questionID } = analytics;
      if (!cookieID || !topic || correct === undefined || time === undefined || !questionID) {
        return {
          success: false,
          message: "Please provide a valid cookieID, topic, correct, time, and questionID",
        };
      }

      const result = await userDataRepo.updateUserAnalytics(cookieID, topic, correct, time, questionID, dbName);
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