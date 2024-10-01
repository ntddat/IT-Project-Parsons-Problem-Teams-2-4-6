import dotenv from 'dotenv'
import userDataService from '../../service/user/userDataService';
import questionService from '../../service/questions/questionsService';
dotenv.config();

const getDbName = () => {
  const dbName = process.env.USERS_DATABASE;
  if (!dbName) {
    throw new Error("Database name is not defined in env file");
  }
  return dbName;
}

const userController = {
  /**
   * Request: CookieID
   * Response: { success, message, userData }
   * userData: { accuracy, numAttempts, attemptsSummary: [ { topic, questions: [ { questionID, topic, context, correct, totalTime, averageTime, numAttempts } ] } ] }
   */

  getUserData: async (req, res) => {
    try {
      const { cookieID } = req.body;
      if (!cookieID) {
        return res.status(httpCodes.BAD_REQUEST).json({
          success: false,
          message: "Please provide a cookieID"
        });
      }
      const dbName = getDbName();
      // fetch user data
      const userData = await userDataService.getUserData(cookieID, dbName);
      if (!userData.success) {
        return res.status(httpCodes.BAD_REQUEST).json({
          success: false,
          message: userData.message
        });
      }
      // adds question details to the user data
      const modifiedUserData = await userDataService.addQuestionDetailsToUserData(userData, dbName);
    
      return res.status(httpCodes.OK).json({
        success: true,
        message: result.message,
        // takes data straight from the user object, with question details added
        userData: modifiedUserData
      });
      
    } catch (e) {
      console.error("Error getting user data:", e);
      return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: e.message
      });
    }
  },

  /**
   * Request: { cookieID, analytics }
   * analytics: { topic, correct, time, questionID }
   * Response: { success, message }
   */

  updateUserAnalytics: async (req, res) => {
    try {
      const { cookieID, analytics } = req.body;
      if (!cookieID || !analytics) {
        return res.status(httpCodes.BAD_REQUEST).json({
          success: false,
          message: "Please provide a cookieID and analytics object"
        });
      }

      const dbName = getDbName();
      const result = await userDataService.updateUserAnalytics(cookieID, analytics, dbName);

      if (!result.success) {
        return res.status(httpCodes.BAD_REQUEST).json({
          success: false,
          message: result.message
        });
      }

      return res.status(httpCodes.OK).json({
        success: true,
        message: result.message
      });
    } catch (e) {
      console.error("Error updating user analytics:", e);
      return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: e.message
      });
    }
  },
}

export default userController;
