import dotenv from 'dotenv';
import attemptService from '../../service/questions/attemptService.js';
import httpCodes from '../../utils/constants/httpsCodes.js';

dotenv.config();

async function getDbName() { 
  const dbName = process.env.QUESTIONS_DATABASE;
  if (!dbName) {
    throw new Error("Database name is not defined in env file");
  }
  return dbName;
}

const attemptController = {
  saveAttempt: async (req, res) => {
    try {
      const { attempt } = req.body;
      if (!attempt) {
        return res.status(httpCodes.BAD_REQUEST).json({
          success: false,
          message: "Please provide an attempt to save"
        });
      }
      const dbName = await getDbName();
      const result = await attemptService.saveAttempt(attempt, dbName);

      if (!result.success) {
        return res.status(httpCodes.BAD_REQUEST).json({
          success: false,
          message: result.message
        });
      }
      // next one in the middleware chain (this is actually a middleware!)
      next();
    } catch (e) {
      console.error("Error saving attempt:", e);
      return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: e.message
      });
    }
  }
}

export default attemptController;