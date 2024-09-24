import userDataRepo from "../database/repository/user/userDataRepo.js";

const userDataService = {
  getUserSummary: async (userId, dbName) => {
    try {
      const user = await userDataRepo.getUserData(userId, dbName);
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
  }
}

export default userDataService;