import httpCodes from "../../utils/constants/httpsCodes.js";
import adminService from "../../service/user/adminService.js";
import { getUsersDbName } from "../../utils/functions/dbName.js";
// ADMIN CONTROLS
const adminController = {
  /**
   * Request: { cookieID }
   * Response: { success, message, summary, topicsInfo }
   * Summary: { accuracy, totalAttempts, averageTime }
   * TopicsInfo: [ { topic, accuracy, totalAttempts, users: [{ cookieID, numAttempts, accuracy, totalTime }] } ]
   */
  summariseInfo: async (req, res) => {
    try {
      const dbName = getUsersDbName();

      const overallInfo = await adminService.summariseInfo(dbName);
      if (!overallInfo.success) {
        return res.status(httpCodes.BAD_REQUEST).json({
          success: false,
          message: overallInfo.message,
          error: overallInfo.error
        });
      }

      const topicsInfo = await adminService.summariseTopicsInfo(dbName);
      if (!topicsInfo.success) {
        return res.status(httpCodes.BAD_REQUEST).json({
          success: false,
          message: topicsInfo.message,
          error: topicsInfo.error
        });
      }

      return res.status(httpCodes.OK).json({
        success: true,
        message: "Successfully summarised information",
        summary: overallInfo.summary,
        topicsInfo: topicsInfo.topicsAnalytics,
      });

    } catch (e) {
      console.error("Error summarising OVERALL information:", e);
      return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: e.message,
        error: e
      });
    }
  },
}

export default adminController;