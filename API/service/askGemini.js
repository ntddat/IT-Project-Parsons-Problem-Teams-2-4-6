import { GoogleGenerativeAI } from '@google/generative-ai';
import { outputParserJson } from './OutputParser.js';
import { generatePrompt } from "../utils/constants/TopicsContexts.js";
import { createCSV, syntaxCheck } from "../utils/functions/compiler.js";
import { getChatHistory } from '../database/repository/questions/chatHistoryRepo.js';
import { getQuestionsDbName } from '../utils/functions/dbName.js';

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Choosing Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: {temperature: 1.0 }});


// TODO: Separate compiler part into separate file, then use that for merging part
async function askGemini(topic, context, userID) {
  try {
    // Starting a full chat
    const questionsDbName = await getQuestionsDbName();
    const history = await getChatHistory(1, questionsDbName)
    const chat = model.startChat({history})
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
      fixed_resp.Code = fixed_resp.Code.join('\n');
      createCSV(fixed_resp.CSV, fixed_resp.CSVName);
      syntaxPassed = await syntaxCheck(fixed_resp.Code);
      console.log("Syntax check success?: " + syntaxPassed + "\n");
    }

    return {
      success: true,
      message: "Asked Gemini successfully",
      fixed_resp: fixed_resp,
    };
  } catch (e) {
    console.error("Error generating question:", e);
    return {
      success: false,
      message: "Error asking Gemini",
    };
  }
}

export default askGemini;