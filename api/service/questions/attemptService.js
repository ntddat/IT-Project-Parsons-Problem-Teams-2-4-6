import attemptRepo from "../../database/repository/questions/attemptRepo";

const attemptService = {
  saveAttempt: async (attempt, dbName) => {
    try {
      const result = await attemptRepo.saveAttempt(attempt, dbName);
      return {
        success: true,
        message: "Attempt saved successfully",
        result: result,
      };
    } catch (e) {
      console.error("Error saving attempt:", e);
      return {
        success: false,
        message: "Error saving attempt",
      };
    }
  },
};

export default attemptService;