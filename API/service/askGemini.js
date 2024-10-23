import { GoogleGenerativeAI } from '@google/generative-ai';
import LZString from 'lz-string';

// Importing our modules
import { outputParserJson, checkUnusedFunctions} from "./OutputParser.js";
import { findClosestTopic } from "../utils/constants/TopicsContexts.js";
import { createCSV, syntaxCheck } from "../utils/functions/compiler.js";
import { PythonShell } from 'python-shell';
import chatHistoryRepo from '../database/repository/questions/chatHistoryRepo.js';
import { getQuestionsDbName } from '../utils/functions/dbName.js';
import { timeoutRetry } from '../utils/functions/TimeoutRetry.js';
import { generatePrompt } from './prompts.js';

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Choosing Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: {temperature: 1.0 }});

async function saveChatHistory(userID, topic, question, context, prompt, questionsDbName) {
  try {
    const createChatHistory = await chatHistoryRepo.createNewChatHistory(userID, topic, context, prompt, question, questionsDbName);
    if (!createChatHistory) {
      return {
        success: false,
        message: 'Error saving a new Chat History',
      };
    }
    return {
      success: true,
      message: 'Chat History saved successfully',
    };
  } catch (e) {
    console.error('Error saving Chat History', e);
    return {
      success: false,
      message: 'Error saving a new Chat History',
    };
  }
}

// TODO: Separate compiler part into separate file, then use that for merging part
async function askGemini(topic, context, userID, regeneration) {
  try {
    // Starting a full chat
    const questionsDbName = await getQuestionsDbName();
    const history = ((userID) ? (await chatHistoryRepo.getChatHistory(userID, questionsDbName)) : []);
    const chat = model.startChat({ history })
    let syntaxPassed = false;
    let prompt, result, resp, fixed_resp;

    console.log("----------\n");
    console.log("START\n");
    console.log("----------\n");

    console.log("\nPROMPT:\n");
    let closestTopic = findClosestTopic(topic);
    prompt = generatePrompt(closestTopic, context, regeneration);
    console.log(prompt);
    //Attempt to prompt gemini, if it fails prompt again
    try {
      result = await chat.sendMessage(prompt);
      resp = result.response.text();
      console.log(resp);
    } catch (error) {
      console.error(error);
    }
    

    // Parsing the JSON response from Gemini
    try {
      fixed_resp = outputParserJson(resp);
    } catch (error) {
      console.error(error);
    }

    console.log(fixed_resp);
      
    // until 20 secs have passed, keep regenerating the code
    // attempt to generate some functional code
    let newCode = await timeoutRetry(fixed_resp.Code, fixed_resp.CSVName, fixed_resp.CSV, 20000);

    // if it managed to generate a problem
    if (newCode !== null) {
      console.log("Generated syntactically correct code!\n");
      fixed_resp.Code = newCode;
      // store the code and prompt here.
      saveChatHistory(userID, topic, resp, context, prompt, questionsDbName);
    }  
    // otherwise, get a backup problem
    else {
      console.log("Unable to generate correct code in 20 secs, getting backup problem!\n");
      let backup = await chatHistoryRepo.getBackupQuestion(userID, topic, context, questionsDbName);
      fixed_resp = outputParserJson(backup.question); 
    } 
    

    let test_string = 'import pandas as pd\n' +
     '\n' +
     '# Load the data\n' +
     'data = pd.read_csv("student_performance.csv")\n' +
     '\n' +
     "# Group the data by 'Subject' and calculate the mean score for each subject\n" +
     'def calculate_average_score   (df):\n' +
     "\treturn df.groupby('Subject')['Score'].mean()\n" +
     '\n' +
     '# Print the average score for each subject\n' +
     'print(calculate_average_score_main(data))';

    console.log(checkUnusedFunctions(fixed_resp.Code));
    //console.log(checkUnusedFunctions(test_string));

    let compressedResp = LZString.compressToEncodedURIComponent(JSON.stringify(fixed_resp));

    return {
      success: true,
      message: "Asked Gemini successfully",
      fixed_resp: compressedResp,
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
