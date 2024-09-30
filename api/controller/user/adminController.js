import httpCodes from "../../utils/constants/httpsCodes";
import adminService from "../../service/user/adminService";

// ADMIN CONTROLS
function getDbName() {
  const dbName = process.env.QUESTIONS_DATABASE;
  if (!dbName) {
    throw new Error("Database name is not defined in env file");
  }
  return dbName;
}

const adminController = {
  summariseInfo: async (req, res) => {
    try {
      const dbName = getDbName();

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