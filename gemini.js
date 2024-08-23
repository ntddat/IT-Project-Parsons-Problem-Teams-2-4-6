// "node gemini.js" to run

require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PythonShell } = require('python-shell')

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Choosing Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// DataFrames, Normalized Mutual Information, Sentence splitting using NLTK
// Correlation, Linear Regression, Decision Tree Classifier, Read/Write CSV files

async function run() {
  // Starting a full chat
  const chat = model.startChat({ history: [] })

  // Prompt to send to AI  
  var prompt = "Create a Python script with the following requirements:\n";
  prompt = prompt.concat("- The code should be 10 lines long\n-It should be about normalized linear regression and plotting\n- It should be about the animal koala\n- It should not have any comments in the code\n- If it uses any extra files, give the file back\n- It should give a description and expected output of the code snippet");
  
  // Inputting the prompt the API
  let result = await chat.sendMessage(prompt);
  var response = result.response.text();
  console.log(response);
  response = formatCode(response);
  console.log(response);

  // Uncomment and edit the prompt if we need to continue the chat
  /*
  prompt = "Give a description for the previously generated script, and if it used an extra file, give the file as well";

  result = await chat.sendMessage(prompt);
  console.log(result.response.text());
  */

  // Running the response through python interpreter
  PythonShell.runString(response, null).then(messages=>{
    console.log("Output:\n");
    console.log(messages);
  });

}

// Removing fluff to get a string of just Python code for the interpreter
// Right now is only removing the ` symbols and "python" at the beginning of the response
function formatCode(response) {
  response = response.replaceAll("`", "");
  for (let i = 0; i < response.length; i++) {
    response = response.slice(0, 0) + response.slice(1)
   if (response.charAt(0) == '\n') {
      break;
    }
  }
  return response;
}

run();

