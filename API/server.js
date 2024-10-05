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
import { generatePrompt } from "./utils/constants/TopicsContexts.js";
import { questionDetailsRepo } from './database/repository/questions/questionDetailsRepo.js';
import { createCSV, syntaxCheck } from "./utils/compiler.js";

// Establishing connection to the database
establishConnection();

// Constants
const port = 8383
var answer = "Haven't queried yet";

/**Should I try catch these initial setup functions ## */

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Choosing Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: {temperature: 1.0 }});

// TODO: Separate compiler part into separate file, then use that for merging part
async function askGemini(topic, context) {
  // Starting a full chat
  const chat = model.startChat({ history: [] })
  let syntaxPassed = false;
  let prompt, result, resp, fixed_resp;
  // Generating a new prompt based on the given topic and context
  prompt = generatePrompt(topic, context);
  console.log(prompt);

  while (!syntaxPassed) {
    //Attempt to prompt gemini, if it fails prompt again
    try {
      result = await chat.sendMessage(prompt);
      resp = result.response.text();
      console.log(resp);
    } catch (error) {
      console.error(error);
      continue;
    }
    

    // Parsing the JSON response from Gemini
    try {
      fixed_resp = outputParserJson(resp);
    } catch (error) {
      console.error(error);
      continue;
    }

    console.log(fixed_resp);
    
    // Checking if the generated code is syntactically correct
    try {
      createCSV(fixed_resp.CSV, fixed_resp.CSVName);
    } catch (error) {
      console.error(error);
      continue;
    }
    
    try {
      syntaxPassed = await syntaxCheck(fixed_resp.Code);
    } catch (error) {
      syntaxPassed = false;
      console.error("Failed to perform syntax check: ", error);
    }
    
    console.log("Syntax check success?: " + syntaxPassed + "\n");

  }

  fixed_resp.Code = replaceSpacesWithTabs(fixed_resp.Code); 
  fixed_resp.Code = processString(fixed_resp.Code); 
  fixed_resp.Code = fixed_resp.Code.join('\n');
  answer = fixed_resp;
}

//Allows the server to see the pages in the App public folder
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

    /**Could expand on this to ensure topic and context lie within acceptable inputs ## */
    if (!topic) {
      res.status(400).send({status: "Topic not received"});
    }
    if (!context) {
      res.status(400).send({status: "Context not received"});
    }

    await askGemini(topic, context);
    res.status(200).send({status: "received"})
})

app.listen(port, () => console.log(format("server has started on port: {}", port)))
