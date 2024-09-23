import httpCodes from "../utils/constants/httpsCodes";
import attemptService from "../service/attemptService";


function getDbName() {
  const dbName = process.env.QUESTIONS_DATABASE;
  if (!dbName) {
    throw new Error("Database name is not defined in env file");
  }
  return dbName;
}

const attemptController = {
  getAttemptsQuestionID: async (res, req) => {
    const { questionID } = req.body;
    const dbName = getDbName();
    const result = await attemptService.getAttemptsFromQuestion(questionID, dbName);
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
      attempts: result.attempts
    });
  },

  getAttemptsCookieID: async (res, req) => {
    const { cookieID } = req.body;
    const dbName = getDbName();
    const result = await attemptService.getAttemptsFromCookie(cookieID, dbName);
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
      attempts: result.attempts
    });
  },

  getNumAttemptsQuestion: async (res, req) => {
    const { questionID } = req.body;
    const dbName = getDbName();
    const result = await attemptService.getNumAttemptsOfQuestion(questionID, dbName);
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
      numAttempts: result.numAttempts
    });
  }
}

export default attemptController;