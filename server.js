
// Importing packages
require('dotenv').config()
const { PythonShell } = require('python-shell')
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const express = require('express')
const format = require('string-format')
const app = express()

// Importing our modules
const parsers = require("./OutputParser");
const topics = require("./TopicsContexts");

// Constants
const port = 8383
var answer = "Haven't queried yet";


const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Choosing Gemini model
//const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: {temperature: .0 }});

// DataFrames, Normalized Mutual Information, Sentence splitting using NLTK
// Correlation, Linear Regression, Decision Tree Classifier, Read/Write CSV files

async function askGemini(topic, context) {
  // Starting a full chat
  const chat = model.startChat({ history: [] })
  
  let prompt1 = topics.generatePrompt(topic, context);
  //console.log(prompt);
  //console.log("\n");
  let result1 = await chat.sendMessage(prompt1);
  console.log(result1);
  let prompt = "Generate your previous response but remove any code comments.\n";
  let result = await chat.sendMessage(prompt);
  let resp = result.response.text();
  //console.log(resp);
  let fixed_resp = parsers.outputParserJson(resp);

  console.log(fixed_resp[0]);
  console.log(fixed_resp[1]);
  console.log(fixed_resp[2]);
  console.log("\n");
  console.log(fixed_resp.Code);

  createCSV(fixed_resp.CSV, fixed_resp.CSVName);

  // Running the response through python interpreter
  PythonShell.runString(fixed_resp.Code, null).then(messages=>{
    console.log("Output:\n");
    console.log(messages);
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
  fs.writeFile(csvName, csvStr, 'utf8', function (err) {
    if (err) {
      console.log("\nCreating CSV file failed!\n");
    }
    else {
      console.log("\nCreating CSV file succeeded!\n");
    }
  });
}


//Allows the server to see the index.html page in the public folder
app.use(express.static('public'))
//Expects to receive json in the app.post method
app.use(express.json())

app.get('/info', (req, res) => {
    res.status(200).json({info: answer})
})


app.post('/', (req,res) => {
    const {parcel} = req.body
    const arr = parcel.split("|")
    topic = arr[1]
    context = arr[0]
    console.log(arr)
    
    askGemini(topic, context)

    if (!parcel) {
        res.status(400).send({status: "failed"})
    }
    res.status(200).send({status: "received"})

})

app.listen(port, () => console.log(format("server has started on port: {}", port)))
