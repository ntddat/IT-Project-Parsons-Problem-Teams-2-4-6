import attemptRepo from "../database/repository/user/attemptRepo";


async function calculateTotalAccuracy(dbName) {
  try {
    const attempts = await attemptRepo.getAllAttempts(dbName);
    const correctAttempts = attempts.filter(attempt => attempt.correct).length;
    // calculate accuracy as a percentage
    const accuracy = Math.round((correctAttempts / attempts.length) * 100);

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

const adminService = {
  summariseInfo: async (dbName) => {
    try {
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

};

export default adminService;