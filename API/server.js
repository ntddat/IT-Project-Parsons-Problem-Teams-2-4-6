// TODO: SPLIT THIS INTO CONTROLLERM MIDDLEWARE, AND SERVICE
// Importing packages
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PythonShell } from 'python-shell';
import express, { static as expressStatic, json } from 'express';
import format from 'string-format';
import cors from 'cors';


dotenv.config();
const app = express()

app.use(express.json());
app.use(cors());

// Importing our modules
import { establishConnection } from './database/connection.js';
import { outputParserJson, replaceSpacesWithTabs, processString } from "./service/OutputParser.js";
import { findClosestTopic } from "./utils/constants/TopicsContexts.js";
import { generatePrompt } from './service/prompts.js';
import { timeoutRetry } from './utils/TimeoutRetry.js';
import { createCSV, syntaxCheck } from "./utils/compiler.js";

// Establishing connection to the database
establishConnection();

// Constants
const port = 8383
var answer = "Haven't queried yet";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Choosing Gemini model
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash", 
  generationConfig: {temperature: 1.0} 
});

// implement a simple delay to not exhaust API
const delay = ms => new Promise(res => setTimeout(res, ms));

async function askGemini(topic, context) {
  // Starting a full chat
  const chat = model.startChat({ history: [] })
  let syntaxPassed = false;
  let prompt, result, resp, fixed_resp;

  // select from the topics
  let newTopic = findClosestTopic(topic);

  console.log("Topic: " + newTopic)

  prompt = generatePrompt(newTopic, context);
  console.log(prompt);

  // while (!syntaxPassed && attempt) {
  //   // Generating a new prompt based on the given topic and context
  //   result = await chat.sendMessage(prompt);
  //   resp = result.response.text();

  //   // Parsing the JSON response from Gemini
  //   fixed_resp = outputParserJson(resp);
      
  //   // Checking if the generated code is syntactically correct
  //   //fixed_resp.Code = fixed_resp.Code.join('\n');   
  //   createCSV(fixed_resp.CSV, fixed_resp.CSVName);
  //   syntaxPassed = await syntaxCheck(fixed_resp.Code);
    
  //   // to prevent API exhaustion (yes that is a thing), delay for 0.25s
  //   await delay(250);
  // }

  // generate the initial code snippet 
  result = await chat.sendMessage(prompt);
  resp = result.response.text();
  fixed_resp = outputParserJson(resp);

  console.log(fixed_resp);

  // until 20 secs have passed, keep regenerating the code
  // attempt to generate some functional code
  let newCode = await timeoutRetry(fixed_resp.Code, fixed_resp.CSVName, fixed_resp.CSV, 20000);

  // if it managed to generate a problem
  if (newCode !== null) {
    fixed_resp.Code = newCode;
    fixed_resp.Code = replaceSpacesWithTabs(fixed_resp.Code); 
    fixed_resp.Code = processString(fixed_resp.Code); 
    fixed_resp.Code = fixed_resp.Code.join('\n');
    answer = fixed_resp;
  }  
  // otherwise, it's really up to you to do whatever
  else {
    console.log("Exception not implemented yet");
  } 
}

//Allows the server to see the index.html page in the public folder
//IN MERGING PROCESS CHANGED FROM PUBLIC TO SRC SO index.html can be in the same folder as main.js
app.use(expressStatic('App'))
//Expects to receive json in the app.post method
app.use(json())

app.get('/info', (req, res) => {
    res.status(200).json({info: answer})
})

app.post('/run-python', async (req, res) => {
  const { pythonCode } = req.body;

  if (!pythonCode) {
    return res.status(400).send('No Python code provided.');
  }

  // Options for PythonShell
 //let options = {
  //  mode: 'text',
  //  pythonPath: './venv/Scripts/python', // Change to 'python3' if needed
  //  pythonOptions: ['-u'],
  //  scriptPath: './'
  //};

  // Run the Python code
  PythonShell.runString(pythonCode) 
    .then(messages => {
      console.log(messages)
      messages = messages.join("\r\n");
      console.log(messages)
      res.json({ output: messages }); // Send the output back to the client
    })
    .catch(err => {
      res.status(500).json({ error: err.message }); // Send any errors back to the client
    });
});

app.post('/api/sendData', async (req,res) => {
    console.log("POST request received"); 
    const { topic, context } = req.body; // Destructure the topic and context from req.body

    console.log("Received topic:", topic);
    console.log("Received context:", context);
    
    await askGemini(topic, context)

    if (!topic && !context) {
        res.status(400).send({status: "failed"})
    }
    res.status(200).send({status: "received"})
})

app.listen(port, () => console.log(format("server has started on port: {}", port)))
