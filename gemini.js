// "npm start" to start

require('dotenv').config()

const { GoogleGenerativeAI } = require('@google/generative-ai');
const parsers = require("./OutputParser");
const topics = require("./TopicsContexts");
const { PythonShell } = require('python-shell')

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Choosing Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// DataFrames, Normalized Mutual Information, Sentence splitting using NLTK
// Correlation, Linear Regression, Decision Tree Classifier, Read/Write CSV files

function originalPrompt() {
  var prompt = "Create a Python script with the following requirements:\n";
  prompt = prompt.concat("- The code should be 10 lines long\n-It should be about normalized linear regression and plotting\n- It should be about the animal koala\n- It should not have any comments in the code\n- If it uses any extra files, give the file back\n- It should give a description and expected output of the code snippet\n");
  return prompt;
}

async function run() {
  
  // Starting a full chat
  const chat = model.startChat({ history: [] })
  
  // another prompt using the original one 
  let prompt = topics.generatePrompt(topics.TOPICS.DecisionTree);
  let another = await chat.sendMessage(prompt);
  let resp = another.response.text();
  console.log(resp);
  console.log(parsers.outputParserJson(resp));
  // Running the response through python interpreter
  /*
  PythonShell.runString(response, null).then(messages=>{
    console.log("Output:\n");
    console.log(messages);
  });
  */
  
}

run();

