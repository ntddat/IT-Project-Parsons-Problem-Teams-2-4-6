import httpCodes from "../utils/constants/httpsCodes";
import adminService from "../service/adminService";

// ADMIN CONTROLS
function getDbName() {
  const dbName = process.env.QUESTIONS_DATABASE;
  if (!dbName) {
    throw new Error("Database name is not defined in env file");
  }
  return dbName;
}

const adminController = {
  summariseInfo: async (res, req) => {
    const dbName = getDbName();
    const result = await adminService.summariseInfo(dbName);
    if (!result.success) {
      res.status(httpCodes.BAD_REQUEST).send({
        success: false,
        message: result.message

      });
      return;
    }
    res.status(httpCodes.OK).send({
      success: true,
      message: result.message,
      summary: result.summary
    });
  },
}

export default adminController;