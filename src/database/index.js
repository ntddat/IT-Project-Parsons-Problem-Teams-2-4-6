// DATABASE CONNECTION GOES HERE

const { MongoClient, ListCollectionsCursor } = require('mongodb');

async function main() {

    const uri = "mongodb+srv://parsonsproblemteams246:Password12345@parsonsproblemcluster.ufx52.mongodb.net/?retryWrites=true&w=majority&appName=ParsonsProblemCluster"

    const client = new MongoClient(uri);

    try 
    {
        await client.connect();
        await listDatabases(client);
        const db = client.db("questions");
        const coll = db.collection("question_details");
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
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}
