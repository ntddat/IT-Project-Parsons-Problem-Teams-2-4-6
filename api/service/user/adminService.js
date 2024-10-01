import attemptRepo from "../../database/repository/questions/attemptRepo";
import userDataRepo from "../../database/repository/user/userDataRepo";

/**
 * Data to display:
 * - Total Attempts
 * - Total Accuracy
 * Each Topic:
 * - Total Attempts
 * - Total Accuracy
 * Student analytics:
 * - Show all students who has attempted a question in this topic
 * - Show numAttempts, accuracy and averageTime
 */

async function calculateTotalAccuracy(dbName) {
  try {
    const accuracy = await attemptRepo.getTotalAccuracy(dbName);
    return accuracy;
  } catch (e) {
    console.error("Error calculating total accuracy:", e);
    return 0;
  }
}

async function calculateTotalAttempts(dbName) {
  try {
    const attempts = await attemptRepo.getTotalNumAttempts(dbName);
    return attempts;
  } catch (e) {
    console.error("Error calculating total attempts:", e);
    return 0;
  }
}

async function calculateAverageTime(dbName) {
  try {
    const averageTime = await attemptRepo.getAverageTime(dbName);
    return averageTime;
  } catch (e) {
    console.error("Error calculating average time:", e);
    return 0;
  }
}

async function calculateTopicAnalytics(dbName) {
  try {
    const topicsAnalytics = await attemptRepo.getTopicsAnalytics(dbName);
    return topicsAnalytics;
  } catch (e) {
    console.error("Error calculating topic analytics:", e);
    return [];
  }
}

const adminService = {
  // Summarises all information to display to the admin: accuracy, totalAttempts, averageTime OF ATTEMPTS
  summariseInfo: async (dbName) => {
    try {
      // for EVERYONE
      const accuracy = await calculateTotalAccuracy(dbName);
      const totalAttempts = await calculateTotalAttempts(dbName);
      const averageTime = await calculateAverageTime(dbName);
      return {
        success: true,
        message: "Successfully summarised information",
        summary: {
          accuracy: accuracy,
          totalAttempts: totalAttempts,
          averageTime: averageTime,
        },
      };
    } catch (e) {
      return {
        success: false,
        message: e.message,
        error: e,
      };
    }
  },

  summariseTopicsInfo: async (dbName) => {
    try {
      const topicsAnalytics = await calculateTopicAnalytics(dbName);
      if (!topicsAnalytics || topicsAnalytics.length === 0) {
        return {
          success: false,
          message: "Error calculating topic analytics",
        };
      }

      const result = [];

      for (const topicData of topicsAnalytics) {
        const userData = await userDataRepo.getUserSummaryOfTopic(topicData.topic, dbName);
        if (!userData) {
          return {
            success: false,
            message: "Error getting user data for topic",
          };
        }
        result.push({
          ...topicData,
          users: userData,
        });
      }
      return {
        success: true,
        message: "Successfully summarised topics information",
        topicsAnalytics: result,
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