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
   * Response format:
   * {
   *  "success": true,
   *  "message": "User data retrieved successfully",
   *  "userData": {
   *   "accuracy": 0.5,
   *   "numAttempts": 10,
   *   "attemptsSummary": [
   *    {
   *     "topic": "DataFrame",
   *     "questions": [
   *      {
   *       "questionID": "1234",
   *       ...question details
   *      },
   *      ....
   *     ]
   *    },
   *    ....
   *    ]
   *   }
   * }
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

      const modifiedUserData = await userDataService.addQuestionDetailsToUserData(userData, dbName);
    
      // They can call this to get all summarised information about the user
      return res.status(httpCodes.OK).json({
        success: true,
        message: result.message,
        // takes data straight from the user object
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
   * Request format:
    {
      "cookieID": "1234",
      "analytics": {
        "topic": "DataFrame",
        "correct": true,
        "time": 100,
        "questionID": "1234"
      }
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
