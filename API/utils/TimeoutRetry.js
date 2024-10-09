import dotenv from 'dotenv';
import { createCSV } from "./compiler.js";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PythonShell } from 'python-shell';

dotenv.config();

/**
 * Given a piece of Python code and the related resources, attempt to return a functional Python code in a given amount of time.
 * @param {string} code The provided Python code 
 * @param {string | null} fileName The file name of the external file the script reads from
 * @param {string | null} fileContent The content of the external file the script reads from
 * @param {number} ms The allowed time to regenerate code in milliseconds
 * @returns {string | null} The fixed code, or null if the code cannot be fixed within the alloted time   
 */
export async function timeoutRetry(code, fileName, fileContent, ms) {
  
  // create a new API endpoint for code regen
  const genAI = new GoogleGenerativeAI(process.env.API_KEY); 
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", 
    generationConfig: {temperature: 1.0} 
  });
  const chat = model.startChat({ history: [] });

  // creates the external file if provided
  if (fileName !== null && fileContent !== null) {
    createCSV(fileContent, fileName);
  } 

  // establish the timer
  let regen = true;
  let fixed = false;
  setTimeout(function() {
    regen = false;
  }, ms);

  // only stops until either the code is fixed 
  // or the timeout occurs
  while (!fixed && regen) {
    // run the Python script 
     

    // check the status code after running
    
    // if code is 1, regenerate
    
    // otherwise, set the status of fixed
  }
}

function regenPrompt(code, filename, fileContent, msg) {

}
