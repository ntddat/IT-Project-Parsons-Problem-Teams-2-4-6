import userDataRepo from "../database/repository/user/userDataRepo.js";

async function getTop5RecentAllTopics(cookieID, dbName) {
  try {
    const recentQuestions = await userDataRepo.getTop5RecentQuestions(cookieID, dbName);
    if (!recentQuestions) {
      return {
        success: false,
        message: "Cannot find any recent questions",
      };
    }
    return recentQuestions
  } catch (e) {
    console.error("Error getting top 5 recent questions:", e);
    return []; // empty array
  }
}


const userDataService = {
  getUserSummary: async (cookieID, dbName) => {
    try {
      const user = await userDataRepo.getUserData(cookieID, dbName);
      if (!user) {
        return {
          success: false,
          message: "Cannot find user",
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
      };
    }
  },

  
}

export default userDataService;