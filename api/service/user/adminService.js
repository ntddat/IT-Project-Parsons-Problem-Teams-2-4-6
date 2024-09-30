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
  } catch (error) {
    console.error("Error calculating total accuracy:", error);
    return 0;
  }
}

async function calculateTotalAttempts(dbName) {
  try {
    const attempts = await attemptRepo.getTotalNumAttempts(dbName);
    return attempts;
  } catch (error) {
    console.error("Error calculating total attempts:", error);
    return 0;
  }
}

async function calculateAverageTime(dbName) {
  try {
    const averageTime = await attemptRepo.getAverageTime(dbName);
    return averageTime;
  } catch (error) {
    console.error("Error calculating average time:", error);
    return 0;
  }
}

async function calculateTopicAnalytics(dbName) {
  try {
    const topicsAnalytics = await attemptRepo.getTopicsAnalytics(dbName);
    return topicsAnalytics;
  } catch (error) {
    console.error("Error calculating topic analytics:", error);
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
    } catch (error) {
      return {
        success: false,
        message: error.message
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
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  },
};

export default adminService;