// TODO: SPLIT THIS INTO CONTROLLERM MIDDLEWARE, AND SERVICE
// Importing packages
import dotenv from 'dotenv';
import { PythonShell } from 'python-shell';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createCSV } from './utils/functions/createCSV.js';
import express, { static as expressStatic, json } from 'express';
import format from 'string-format';
import { establishConnection } from './database/connection.js';
dotenv.config();
const app = express()

// Importing our modules
import { outputParserJson } from "./service/OutputParser.js";
import { generatePrompt } from "./utils/constants/TopicsContexts.js";
import { formQuestionDetails } from './service/questions/questionService.js';
import { questionDetailsRepo } from './database/repository/questions/questionDetailsRepo.js';

// Establishing connection to the database
establishConnection();

// Constants
const port = 8383
var answer = "Haven't queried yet";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Choosing Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// DataFrames, Normalized Mutual Information, Sentence splitting using NLTK
// Correlation, Linear Regression, Decision Tree Classifier, Read/Write CSV files

async function askGemini(topic, context) {
  // Starting a full chat
  const chat = model.startChat({ history: [] })
  
  // another prompt using the original one 
  let prompt = generatePrompt(topic, context);
  let result = await chat.sendMessage(prompt);
  let resp = result.response.text();
  console.log(resp);
  let fixed_resp = outputParserJson(resp);

  console.log(fixed_resp);
  console.log("\n");
  console.log(fixed_resp.Code);

  createCSV(fixed_resp.CSV, fixed_resp.CSVName);

  // Running the response through python interpreter
  PythonShell.runString(fixed_resp.Code, null).then(messages=>{
    console.log("Output:\n");
    console.log(messages);
  });
  let questionDetails = formQuestionDetails(fixed_resp, topic, context);
  console.log(`Question details: ${questionDetails}`);
  
  await questionDetailsRepo.saveApprovedQuestion(questionDetails, "questions");
  console.log("\n>>>>>>>>>> Question saved to the database\n");
}


//Allows the server to see the index.html page in the public folder
app.use(expressStatic('public'))
//Expects to receive json in the app.post method
app.use(json())

app.get('/info', (req, res) => {
    res.status(200).json({info: answer})
})


app.post('/', (req,res) => {
    const {parcel} = req.body
    const arr = parcel.split("|")
    let topic = arr[1]
    let context = arr[0]
    
    askGemini(topic, context)
    if (!parcel) {
        res.status(400).send({status: "failed"})
    }
    res.status(200).send({status: "received"})

})

app.listen(port, () => console.log(format("server has started on port: {}", port)))
