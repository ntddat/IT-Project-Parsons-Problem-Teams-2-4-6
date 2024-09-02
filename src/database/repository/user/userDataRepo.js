import { getDatabaseConnection } from "../../index.js";
import { UserDataSchema } from "../../models/userDataModel.js";

export const getUserData = async (userID, dbName) => {
  const userDataCollection = process.env.USER_DATA_COLLECTION;
  if (!userDataCollection) {
    throw new Error(stringConstants.USER_DATA_COLLECTION_UNDEFINED);
  }
  const dbConnection = getDatabaseConnection(dbName);
  const userDataModel = dbConnection.model(
    userDataCollection,
    UserDataSchema
  );

  return await userDataModel.findOne({
    userID: userID,
  });
}