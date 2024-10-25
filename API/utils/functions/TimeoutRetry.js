import dotenv from 'dotenv';
import { createCSV } from "./compiler.js";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PythonShell } from 'python-shell';
import {replaceSpacesWithTabs, processString, checkUnusedFunctions} from '../../service/OutputParser.js';

//import messages from '../constants/messages.js';

dotenv.config();

/**
 * Given a piece of Python code and the related resources, attempt to return a functional Python code in a given amount of time.
 * @param {string} code The provided Python code 
 * @param {string | null} fileName The file name of the external file the script reads from
 * @param {string | null} fileContent The content of the external file the script reads from
 * @param {number} ms The allowed time to regenerate code in milliseconds
 * @returns {string | null} The fixed code, or null if the code cannot be fixed within the alloted time   
 */
export async function timeoutRetry(code, fileName, fileContent, ms, topicCounts, topicContextCounts) {
  let regenDelay = 2000;
  
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

  let errored = false;
  let functioned = false;
  let timedOut = false;

  // establish the timer
  let regen = true;
  let fixed = false;
  let unusedFunction = true;
  
  setTimeout(function() {
    regen = false;
    unusedFunction = false;
    timedOut = true;
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

        errored = true;

        // Parse the AI response to generate new code
        code = parseResponse(respText);
      } catch (chatError) {
        console.log("Error during chat AI response:", chatError);
        console.log("Doubling regen delay in case of too frequent prompting error")
        regenDelay = regenDelay * 2;
      }
      regenDelay = regenDelay * 2;

      // Wait for a short delay before retrying
      await delay(regenDelay);
    }

    // If the code has been successfully fixed, break out of the loop
    if (fixed) {
      break;
    }
  }

  //Remove comments from code
  code = replaceSpacesWithTabs(code); 
  code = processString(code); 
  code = code.join('\n');

  //Ensure that the code doesn't contain any functions that are never called
  unusedFunction = checkUnusedFunctions(code);
  while(unusedFunction) {
    functioned = true;
    console.log("Not all functions called! Did not call function:", unusedFunction);

    // If there's an error, regenerate the code
    let errMsg = "You did not call the function" + unusedFunction;
    let reprompt = regenPrompt(code, fileName, fileContent, errMsg);

    try {
      let resp = await chat.sendMessage(reprompt);
      let respText = resp.response.text();
      console.log("retrying:")
      console.log(respText);

      // Parse the AI response to generate new code
      code = parseResponse(respText);
    } catch (chatError) {
      console.log("Error during chat AI response:", chatError);
      console.log("Doubling regen delay in case of too frequent prompting error")
      regenDelay = regenDelay * 2;
    }
    regenDelay = regenDelay * 2;
    unusedFunction = checkUnusedFunctions(code);
    // Wait for a short delay before retrying
    await delay(regenDelay);
  }

  console.log(regen);
  if (!timedOut) {
    if (!errored && !functioned) {
      topicCounts[1] += 1;
      topicContextCounts[1] += 1;
    }
    else if (!errored && functioned) {
      topicCounts[2] += 1;
      topicContextCounts[2] += 1;
    }
    else if (errored && !functioned) {
      topicCounts[3] += 1;
      topicContextCounts[3] += 1;
    }
    else {
      topicCounts[4] += 1;
      topicContextCounts[4] += 1;
    }
  }

  return regen ? {code: code, topic: topicCounts, context: topicContextCounts} : null;
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

async function regenCode() {
  
}
