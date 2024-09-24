import attemptRepo from "../database/repository/user/attemptRepo";

const attemptService = {
  getAttemptsFromQuestion: async (questionId) => {
    try {
      const attempts = await attemptRepo.getAttemptsDetailsFromQuestionID(questionId, dbName);
      if (!attempts) {
        return {
          success: false,
          message: "Cannot find any attempts for this question",
        };
      }
      return {
        success: true,
        message: "Attempts retrieved successfully",
        attempts: attempts,
      };
    } catch (e) {
      console.error("Error getting attempts from question:", e);
      return {
        success: false,
        message: "Error getting attempts from question",
      };
    }
  },

  getAttemptsFromCookie: async (userId) => {
    try {
      const attempts = await attemptRepo.getAttemptsDetailsFromCookieID(userId, dbName);
      if (!attempts) {
        return {
          success: false,
          message: "Cannot find any attempts for this cookie",
        };
      }
      return {
        success: true,
        message: "Attempts retrieved successfully",
        attempts: attempts,
      };
    } catch (e) {
      console.error("Error getting attempts from cookie:", e);
      return {
        success: false,
        message: "Error getting attempts from cookie",
      };
    }
  },

  getAttemptsFromCookieByTopic: async (userId, topic) => {
    try {
      const attempts = await attemptRepo.getAttemptsDetailsFromCookieIDByTopic(userId, dbName);
      if (!attempts) {
        return {
          success: false,
          message: "Cannot find any attempts for this cookie",
        };
      }
      const attemptsByTopic = attempts.filter((attempt) => attempt.topic === topic);
      return {
        success: true,
        message: "Attempts retrieved successfully",
        attempts: attemptsByTopic,
      };
    } catch (e) {
      console.error("Error getting attempts from cookie by topic:", e);
      return {
        success: false,
        message: "Error getting attempts from cookie by topic",
      };
    }
  },

  getNumAttemptsOfQuestion: async (questionId) => {
    try {
      const numAttempts = await attemptRepo.getNumAttemptsQuestion(questionId, dbName);
      if (!numAttempts) {
        return {
          success: false,
          message: "Cannot find any attempts for this question",
        };
      }
      return {
        success: true,
        message: "Number of attempts retrieved successfully",
        numAttempts: numAttempts,
      };
    } catch (e) {
      console.error("Error getting number of attempts from question:", e);
      return {
        success: false,
        message: "Error getting number of attempts from question",
      };
    }
  },
};

export default attemptService;