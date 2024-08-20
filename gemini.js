// "node gemini.js" to run

require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Choosing Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// DataFrames, Normalized Mutual Information, Sentence splitting using NLTK
// Correlation, Linear Regression, Decision Tree Classifier, Read/Write CSV files

async function run() {
  var prompt = "Create a Python script with the following requirements:\n";
  prompt = prompt.concat("- The code should be 10 lines long\n- It should have a description of the code after the snippet\n-It should be about linear regression\n- It should be about the animal koala");
  // Starting a full chat
  const chat = model.startChat({ history: [] })
  let result = await chat.sendMessage(prompt);
  var code_str = result.response.text();
  console.log(code_str);

  prompt = prompt.concat("\n- It should be different from any previous scripts");

  result = await chat.sendMessage(prompt);
  console.log(result.response.text());
}

function separateCodeAndDesc(response) {
  
}

run();

