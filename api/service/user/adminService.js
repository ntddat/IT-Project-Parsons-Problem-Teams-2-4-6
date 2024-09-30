import attemptRepo from "../../database/repository/questions/attemptRepo";

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
  summariseInfo: async (dbName) => {
    try {
      // for all students
      const accuracy = await calculateTotalAccuracy(dbName);
      const totalAttempts = await calculateTotalAttempts(dbName);
      const averageTime = await calculateAverageTime(dbName);
      return {
        success: true,
        message: "Successfully summarised information",
        accuracy: accuracy,
        totalAttempts: totalAttempts,
        averageTime: averageTime,
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
      return {
        success: true,
        message: "Successfully summarised topics information",
        topicsAnalytics: topicsAnalytics,
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