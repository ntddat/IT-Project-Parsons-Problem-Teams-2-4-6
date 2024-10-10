import { GoogleGenerativeAI } from '@google/generative-ai';

// Importing our modules
import { outputParserJson, replaceSpacesWithTabs, processString } from "./OutputParser.js";
import { generatePrompt } from "../utils/constants/TopicsContexts.js";
import { createCSV, syntaxCheck } from "../utils/functions/compiler.js";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Choosing Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: {temperature: 1.0 }});

// TODO: Separate compiler part into separate file, then use that for merging part
async function askGemini(topic, context) {
  try {
    // Starting a full chat
    const chat = model.startChat({ history: [] })
    let syntaxPassed = false;
    let prompt, result, resp, fixed_resp;

    while (!syntaxPassed) {
      prompt = generatePrompt(topic, context);
      //Attempt to prompt gemini, if it fails prompt again
      try {
        result = await chat.sendMessage(prompt);
        resp = result.response.text();
        console.log(resp);
      } catch (error) {
        console.error(error);
        continue;
      }
      

      // Parsing the JSON response from Gemini
      try {
        fixed_resp = outputParserJson(resp);
      } catch (error) {
        console.error(error);
        continue;
      }

      console.log(fixed_resp);
      
      // Checking if the generated code is syntactically correct
      try {
        createCSV(fixed_resp.CSV, fixed_resp.CSVName);
      } catch (error) {
        console.error(error);
        continue;
      }
      
      try {
        console.log("Type: " + typeof(fixed_resp.Code));
        syntaxPassed = await syntaxCheck(fixed_resp.Code);
      } catch (error) {
        syntaxPassed = false;
        console.error("Failed to perform syntax check: ", error);
      }
      
      console.log("Syntax check success?: " + syntaxPassed + "\n");
    }
    fixed_resp.Code = replaceSpacesWithTabs(fixed_resp.Code); 
    fixed_resp.Code = processString(fixed_resp.Code); 
    fixed_resp.Code = fixed_resp.Code.join('\n');

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
