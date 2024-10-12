import { GoogleGenerativeAI } from '@google/generative-ai';

// Importing our modules
import { outputParserJson, replaceSpacesWithTabs, processString } from "./OutputParser.js";
import { generatePrompt, findClosestTopic } from "../utils/constants/TopicsContexts.js";
import { createCSV, syntaxCheck } from "../utils/functions/compiler.js";
import { PythonShell } from 'python-shell';
import chatHistoryRepo from '../database/repository/questions/chatHistoryRepo.js';
import { getQuestionsDbName } from '../utils/functions/dbName.js';
import { timeoutRetry } from '../utils/functions/TimeoutRetry.js';

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
async function askGemini(topic, context, userID) {
  try {
    // Starting a full chat
    const questionsDbName = await getQuestionsDbName();
    const history = ((userID) ? (await chatHistoryRepo.getChatHistory(userID, questionsDbName)) : []);
    const chat = model.startChat({ history })
    let syntaxPassed = false;
    let prompt, result, resp, fixed_resp;

    let closestTopic = findClosestTopic(topic);
    prompt = generatePrompt(topic, context);
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
      fixed_resp.Code = newCode;
      fixed_resp.Code = replaceSpacesWithTabs(fixed_resp.Code); 
      fixed_resp.Code = processString(fixed_resp.Code); 
      fixed_resp.Code = fixed_resp.Code.join('\n');
    }  
    // otherwise, it's really up to you to do whatever
    else {
      console.log("Exception not implemented yet");
    } 
    // i need to store the code and prompt here.
    saveChatHistory(userID, topic, resp, context, prompt, questionsDbName);

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
/*
export async function timeoutRetry(code, fileName, fileContent, ms) {
  
  const delay = ms => new Promise(res => setTimeout(res, ms));
  // create a new API endpoint for code regen
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", 
    generationConfig: {temperature: 1.0} 
  });
  const chat = model.startChat({ history: [] });

  // creates the external file if provided
  if (fileName !== "" && fileContent !== "") {
    createCSV(fileContent, fileName);
  } 

  // establish the timer
  let regen = true;
  let fixed = false;
  
  setTimeout(function() {
    regen = false;
  }, ms);

  while (regen) {
    fixed = false; // Reset fixed to false on each iteration

    try {
      // Run Python code
      await PythonShell.runString(code, null);
      console.log("Syntax check success!\n") 
      fixed = true;
    } catch (err) {
      console.log("Error caught:", err);
      console.log("Syntax check failed!\n") 

      // If there's an error, regenerate the code
      let errMsg = err.stack;
      let reprompt = regenPrompt(code, fileName, fileContent, errMsg);

      try {
        let resp = await chat.sendMessage(reprompt);
        let respText = resp.response.text();
        console.log(respText);

        // Parse the AI response to generate new code
        code = parseResponse(respText);
      } catch (chatError) {
        console.log("Error during chat AI response:", chatError);
      }

      // Wait for a short delay before retrying
      await delay(125);
    }

    // If the code has been successfully fixed, break out of the loop
    if (fixed) {
      break;
    }
  }

  console.log(regen);

  return regen ? code : null;
}

function regenPrompt(code, filename, fileContent, msg) {
  let prompt = "Given the following piece of Python code:\n";  
  prompt += code + "\n";
  if (filename !== null && fileContent !== null) {
    prompt += "And the code reads from the following dataset:\n";
    prompt += filename + ":\n";
    prompt += fileContent + "\n";
  }
  prompt += "The code yields the following error:\n";
  prompt += msg + "\n";
  prompt += "Return the Python code that has the issue resolved.\n";
  prompt += "Format the response such that it only contains the Python code wrapped around ```python```.\n";
  return prompt;
}

function parseResponse(resp) {

  let parseCode = /```python\n([\s\S]*?)```/g;
  let doParse = parseCode.exec(resp);
  if (doParse === null) {
    throw messages.INVALID_OUTPUT_FORMAT;
  }

  let parsedData = doParse[1];
  return parsedData;
}
*/

export default askGemini;
