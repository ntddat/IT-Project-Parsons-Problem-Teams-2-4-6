// TODO: SPLIT THIS INTO CONTROLLERM MIDDLEWARE, AND SERVICE
// Importing packages
import dotenv from 'dotenv'
import { PythonShell } from 'python-shell';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { writeFile } from 'fs';
import express, { static as expressStatic, json } from 'express';
import format from 'string-format';
const app = express()
dotenv.config();

// Importing our modules
import { outputParserJson } from "./service/OutputParser.js";
import { generatePrompt } from "./utils/constants/TopicsContexts.js";

// Constants
const port = 8383
var answer = "Haven't queried yet";


const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Choosing Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: {temperature: 1.0 }});

async function askGemini(topic, context) {
  // Starting a full chat
  const chat = model.startChat({ history: [] })
  let syntaxPassed = false;
  let prompt, result, resp, fixed_resp;

  while (!syntaxPassed) {
    // Generating a new prompt based on the given topic and context
    prompt = generatePrompt(topic, context);
    result = await chat.sendMessage(prompt);
    resp = result.response.text();
    console.log(resp);

    // Parsing the JSON response from Gemini
    fixed_resp = outputParserJson(resp);

    console.log(fixed_resp);
    console.log(fixed_resp.Code);
    
    // Checking if the generated code is syntactically correct
    syntaxPassed = await syntaxCheck(fixed_resp);
    console.log("Syntax check success?: " + syntaxPassed + "\n");
    
  }
  
}

function syntaxCheck(fixed_resp) {
  createCSV(fixed_resp.CSV, fixed_resp.CSVName);

  // Writing the generated code snippet to a Python script (to run through interpreter)
  writeFile("script.py", fixed_resp.Code, 'utf-8', function(err) {
    if (err) {
      console.log("\nCreating python script failed!\n");
    }
    else {
      console.log("\nCreating python script succeeded!\n");
    }
  });

  // Running the response through python interpreter
  let pyShell = new PythonShell("script.py", { mode: 'text' });

  // Printing the output
  pyShell.on('message', function(message) {
    console.log("Output:\n");
    console.log(message);
  });
  
  return new Promise(function(resolve, reject) {
    // End the input stream and allow the process to exit
    pyShell.end(function(err, code, signal) {
      //if (err) throw err;
      if (err) {
        console.log("The error is:\n" + err + "\n");
        resolve(false);
      }
      else {
        console.log("yo\n");
        resolve(true);
      }
      console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
      console.log('finished');
    });
  });
}

function createCSV(csvStr, csvName) {
  // If no CSV files are used by the generated code
  if ((typeof csvStr == "string" && csvStr.length == 0) || 
    (csvStr == null) || (csvStr == 'null') || (csvStr == 'Null') ||
    (csvStr == 'none') || (csvStr == 'None')) {
    return;
  }

  // Creating the CSV file used by the code
  writeFile(csvName, csvStr, 'utf8', function (err) {
    if (err) {
      console.log("\nCreating CSV file failed!\n");
    }
    else {
      console.log("\nCreating CSV file succeeded!\n");
    }
  });
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
