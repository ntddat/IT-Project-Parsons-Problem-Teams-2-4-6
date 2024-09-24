import dotenv from 'dotenv';
import { getDatabaseConnection } from '../../connection.js';
import messages from '../../../utils/constants/messages.js';
import UserDataSchema from '../../model/user/userDataModel.js';

dotenv.config();

const getUserDataModel = async (dbName) => {
  const userDataCollection = process.env.USER_DATA_COLLECTION;
  if (!userDataCollection) {
    throw new Error(messages.USER_COLLECTION_UNDEFINED);
  }
  const dbConnection = await getDatabaseConnection(dbName);
  return dbConnection.model(userDataCollection, UserDataSchema);
}

const userDataRepo = {
  getUserData: async (cookieID, dbName) => {
    const userDataModel = await getUserDataModel(dbName);
    return await userDataModel.findOne({cookieID: cookieID});
  },
  
  getUserSummaryOfTopic: async (cookieID, topic, dbName) => {
    try {
      const userDataModel = await getUserDataModel(dbName);
      const userData = await userDataModel.findOne(
        {cookieID: cookieID},
        {
          cookieID: 1,
          attemptsSummary: { $elemMatch: { topic: topic } },
        }
      );
      if (!userData || !userData.attemptsSummary || !userData.attemptsSummary.length) {
        console.log(`No data found for topic "${topic}"`);
        return null;
      }
      const topicData = {
        cookieID: userData.cookieID, // Include the cookieID
        ...userData.attemptsSummary[0], // Spread the matched topic object
      };
      return topicData;
    } catch (error) {
      console.error("Error getting user summary of topic:", error);
      return
    }
  }
}

export default userDataRepo;