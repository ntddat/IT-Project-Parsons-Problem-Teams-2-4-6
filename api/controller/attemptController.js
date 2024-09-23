import httpCodes from "../utils/constants/httpsCodes";
import attemptService from "../service/attemptService";


function getDbName() {
  const dbName = process.env.QUESTIONS_DATABASE;
  if (!dbName) {
    throw new Error("Database name is not defined in env file");
  }
  return dbName;
}

async function getAttemptsQuestionID(res, req) {
  const { questionID } = req.body;
  const dbName = getDbName();
  const attempts = await attemptService.getAttemptsFromQuestion(questionID, dbName);
  if (!attempts.success) {
    res.status(BAD_REQUEST).send({
      success: false,
      message: "Cannot find any attempts for this question"
    });
  }
}

async function getAttemptsCookieID(res, req) {
  const { cookieID } = req.body;
  const dbName = getDbName();
  const attempts = await attemptService.getAttemptsFromCookie(cookieID, dbName);
  if (!attempts.success) {
    res.status(BAD_REQUEST).send({
      success: false,
      message: "Cannot find any attempts for this cookie"
    });
  }
}

async function getNumAttemptsQuestion(res, req) {
  const { questionID } = req.body;
  const dbName = getDbName();
  const numAttempts = await attemptService.getNumAttemptsOfQuestion(questionID, dbName);
  if (!numAttempts) {
    res.status(BAD_REQUEST).send({status: "Cannot find any attempts for this question"});
  }
}