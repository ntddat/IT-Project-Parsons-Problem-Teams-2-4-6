
require('dotenv').config();

const getPastPromptsModel = async (dbName) => {
  const pastPromptsCollection = process.env.PAST_PROMPTS_COLLECTION;
  if (!pastPromptsCollection) {
    throw new Error(messages.PAST_PROMPTS_COLLECTION_UNDEFINED);
  }
  const dbConnection = await getDatabaseConnection(dbName);
  return dbConnection.model(pastPromptsCollection, PastPromptsSchema);
}

const getPastPromptsRepo = {
  getPastPrompts: async (dbName) => {
    const pastPromptsModel = await getPastPromptsModel(dbName);
    return await pastPromptsModel.find({});
  }
}

export default getPastPromptsRepo;