import askGemini from "../service/askGemini.js";
import dotenv from 'dotenv';
dotenv.config();

function getDbName() {
  const dbName = process.env.QUESTIONS_DATABASE;
  if (!dbName) {
    throw new Error("Database name is not defined in env file");
  }
  return dbName;
}

// Saves an (approved) question to the database. NOTE: MIGHT NOT NEED THIS
async function saveQuestion (req, res) {
  const dbName = getDbName();
  const { topic, context } = req.body; // Destructure the topic and context from req.body
}

// Uses askGemini to generate a question based on the topic and context
async function generateQuestion (req, res) {
  console.log("POST request received"); 
  const { topic, context } = req.body; // Destructure the topic and context from req.body

  console.log("Received topic:", topic);
  console.log("Received context:", context);
  
  await askGemini(topic, context)

  if (!topic && !context) {
      res.status(400).send({status: "failed"})
  }
  res.status(200).send({status: "received"})
}

export default generateQuestion;