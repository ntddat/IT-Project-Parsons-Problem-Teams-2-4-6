// "npm start" to start

require('dotenv').config()

const { GoogleGenerativeAI } = require('@google/generative-ai');
const parsers = require("./OutputParser");
const topics = require("./TopicsContexts");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Choosing Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// DataFrames, Normalized Mutual Information, Sentence splitting using NLTK
// Correlation, Linear Regression, Decision Tree Classifier, Read/Write CSV files

function generateFromPrompt() {

  // given a prompt, give the output in json 
  let prompt = "Create a Python script with the following requirements:\n"
    
    // topic + context
    .concat("- The code must create a Linear Regression model\n")
    .concat("- The code must use the Scikit Learn library\n")
    .concat("- The code must create the model from a CSV file\n")
    
    // code formatting requirements
    .concat("- The code must not contain comment\n")
    .concat("- The code must not contain two or more consecutive newline characters\n")
    .concat("- The code must be written with 12 lines")
    
    // response format requirements
    .concat("Give a response in JSON file format with the following attributes:\n")
    .concat("- Code: The generated code.\n")
    .concat("- Description: Briefly describe what the code does")
    .concat("- CSV: If the code reads from any CSV file(s), give an example CSV; otherwise, leave this blank");
    

  return prompt;

}

function originalPrompt() {
  var prompt = "Create a Python script with the following requirements:\n";
  prompt = prompt.concat("- The code should be 10 lines long\n-It should be about normalized linear regression and plotting\n- It should be about the animal koala\n- It should not have any comments in the code\n- If it uses any extra files, give the file back\n- It should give a description and expected output of the code snippet\n");
  prompt += "Format the response in JSON format";
  return prompt;
}

async function run() {
  
  let prompt = generateFromPrompt();

  // Starting a full chat
  const chat = model.startChat({ history: [] })
  //let result = await chat.sendMessage(prompt);
  //var response = result.response.text();
  //console.log("Raw JSON output");
  //console.log(response);
  //
  //// right now the response is wrapped around ```json{}```, we need to get the thing out 
  //let parsedData = parsers.outputParserJson(response);
  //console.log(parsedData);

  // another prompt using the original one 
  let prompt2 = originalPrompt();
  let another = await chat.sendMessage(prompt2);
  // console.log("Another one:");
  // console.log("Prompt:\n".concat(prompt2));
  let resp = another.response.text();
  console.log(resp);
  // console.log("----------------------------------------");
  // let out = parsers.outputParser(resp);
  // out.forEach(E => {
  //   console.log(E);
  //   console.log("----------------------------------------");
  // });
  // console.log(out.length);
}

run();

