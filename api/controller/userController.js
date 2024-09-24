import dotenv from 'dotenv'
dotenv.config();

const getDbName = () => {
  const dbName = process.env.USERS_DATABASE;
  if (!dbName) {
    throw new Error("Database name is not defined in env file");
  }
  return dbName;
}

const userController = {
  getUserData: async (req, res) => {
    const { cookieID } = req.body;
    const dbName = getDbName();
    const result = await userDataService.getUserData(cookieID, dbName);
    if (!result.success) {
      res.status(httpCodes.BAD_REQUEST).send({
        success: false,
        message: result.message
      });
      return;
    }
    // They can call this to get all summarised information about the user
    res.status(httpCodes.OK).send({
      success: true,
      message: result.message,
      accuracy: result.userData.accuracy,
      numAttempts: result.userData.numAttempts,
      attemptsSummary: result.userData.attemptsSummary
    });
  },
}

