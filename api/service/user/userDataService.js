import userDataRepo from "../../database/repository/user/userDataRepo.js";

const userDataService = {
  getUserSummary: async (cookieID, dbName) => {
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

  getTop5RecentAllTopics: async (cookieID, dbName) => {
    try {
      const recentQuestions = await userDataRepo.getTop5RecentQuestions(cookieID, dbName);
      if (!recentQuestions || recentQuestions.length === 0) {
        return {
          success: false,
          message: "Cannot find any recent questions",
          recentQuestions: [],
        };
      }
      return {
        success: true,
        message: "Recent questions retrieved successfully",
        recentQuestions: recentQuestions,
      };
    } catch (e) {
      console.error("Error getting top 5 recent questions:", e);
      return {
        success: false,
        message: "Error getting top 5 recent questions",
        recentQuestions: [],
      }; // empty array
    }
  },
}

export default userDataService;