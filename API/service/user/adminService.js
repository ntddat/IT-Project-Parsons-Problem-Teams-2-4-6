import userDataRepo from "../../database/repository/user/userDataRepo.js";

const adminService = {
  // Summarises all information to display to the admin: accuracy, totalAttempts of EVERYONE
  summariseInfo: async (topicsAnalytics) => {
    try {
      // sum of all questions and correct answers from all topics
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

  /**
   * @param {*} usersDbName: the name of the database containing the user_data collection 
   * @returns a list of topics with the total number of questions, accuracy, and users who have attempted the topic
   */
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