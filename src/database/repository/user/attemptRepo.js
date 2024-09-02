import { getDatabaseConnection } from "../../index.js";
import { AttemptSchema } from "../../models/attemptSchema";

export const getUserAttemptDetails = async (userID, dbName) => {
  const attemptCollection = process.env.ATTEMPT_COLLECTION;
  if (!attemptCollection) {
    throw new Error(stringConstants.ATTEMPT_COLLECTION_UNDEFINED);
  }
  const dbConnection = getDatabaseConnection(dbName);
  const attemptModel = dbConnection.model(
    attemptCollection,
    AttemptSchema
  );

  return await attemptModel.find({
    userID: userID,
  });
}
