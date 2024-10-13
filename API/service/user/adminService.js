import userDataRepo from "../../database/repository/user/userDataRepo.js";

const adminService = {
  // Summarises all information to display to the admin: accuracy, totalAttempts of EVERYONE
  summariseInfo: async (topicsAnalytics) => {
    try {
      // for EVERYONE
      const totalQuestions = topicsAnalytics.reduce((acc, topic) => acc + topic.numQuestions, 0);
      const totalCorrect = topicsAnalytics.reduce((acc, topic) => acc + topic.numCorrect, 0);
      const accuracy = totalQuestions === 0 
      ? 0 
      : Math.round(totalCorrect / totalQuestions * 100 * 100) / 100;
      return {
        success: true,
        message: "Successfully summarised information",
        summary: {
          accuracy: accuracy,
          numQuestions: totalQuestions,
        },
      };
    } catch (e) {
      return {
        success: false,
        message: e.message,
      };
    }
  },

  summariseTopicsInfo: async (usersDbName) => {
    try {
      const userData = await userDataRepo.getUserSummaryOfTopic(usersDbName);
      if (!userData) {
        return {
          success: false,
          message: "Error summarising topics information",
        };
      }

      return {
        success: true,
        message: "Successfully summarised topics information",
        topicsAnalytics: userData,
      };
    } catch (e) {
      return {
        success: false,
        message: e.message
      };
    }
  },
};

export default adminService;