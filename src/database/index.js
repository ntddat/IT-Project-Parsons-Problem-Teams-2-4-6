import { MongoClient, ListCollectionsCursor } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const mongoUsername = process.env.MONGO_DB_USERNAME;
const mongoPassword = process.env.MONGO_DB_PASSWORD;
const mongoClusterUrl = process.env.MONGO_DB_CLUSTER_URL;
const mongoClusterName = process.env.MONGO_DB_CLUSTER_NAME;
const questionsDbName = process.env.QUESTIONS_DATABASE;
const mongoOptions = process.env.MONGO_DB_OPTIONS || '';
const questionsDetailsCollection = process.env.QUESTION_DETAILS_COLLECTION;

async function main() {

    const mongoUri = `mongodb+srv://${mongoUsername}:${mongoPassword}@${mongoClusterUrl}/${mongoOptions}&appName=${mongoClusterName}`;

    const client = new MongoClient(mongoUri);

    try 
    {
        await client.connect();
        await listDatabases(client);
        const db = client.db(questionsDbName);
        const coll = db.collection(questionsDetailsCollection);
        const cursor = coll.find();
        await cursor.forEach(console.log);
    } 

    catch (e) 
    {
        console.error(e);
    } 
    
    finally 
    {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client) 
{
    let databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}