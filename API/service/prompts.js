import { TOPICS, SUBTOPICS } from "../utils/constants/TopicsContexts.js"; // access topics for generation

let dataFormat = [ "Python Dictionary", "external CSV file" ]
let ptr = 1;

/**
 * Given a topic and a context, generate a prompt that, when fed into the Gemini API, will
 * return a piece of Python code, along with any additional resources it may require.
 * @param {string} topic 
 * @param {string} context 
 * @returns The prompt to be fed into Gemini API
 */
export function generatePrompt(topic, context, regeneration) {
  
  if (Object.values(TOPICS).indexOf(topic) === -1) {
    throw "Invalid topic passed";
  }
  
  let prompt = "With the topic of \"" + topic + "\" and context \"" + context + "\", follow these steps:\n";

  //If we regenerate then we want gemini to give a different question 
  //regeneration has to be of string type so we don't use booleans 
  //This is because we always use axios.get which converts everything into string so it can be put in URL
  if (regeneration == "yes") {
    prompt += "- Ensure you response is completely different from your past responses.\n"
  }
  
  let coreTechniqeIndex = Math.floor(Math.random() * SUBTOPICS.get(topic).length);
  let coreTechniqe = SUBTOPICS.get(topic)[coreTechniqeIndex];


  // The data will be generated before the code does, and we will make it such that the code adheres strictly
  // to said data. This is to minimize the chance of code trying to access elements that don't exist in the data

  // since NLTK works with a different form of data, consider it seperately
  if (topic === TOPICS.NLTK) {
    prompt += "- Create a Python string relating to the given context.\n"
    prompt += "- Generate a piece of Python code using the created string using the core technique: \"" + coreTechniqe + "\".\n";
  } else {
    prompt += "- Create " + dataFormat[ptr] + " based on the given context.\n";
    prompt += "- Generate a piece of Python code that reads from the generated " + dataFormat[ptr] + " using the core technique: \"" + coreTechniqe + "\".\n";
    ptr = (ptr + 1) % 2;
  }

  // randomly selecting elements
  // due to the process of tokenization in LLM, these kinds of model are terrible at understanding numeric value, 
  // so i figure it would be better if we translate these to English representations
  const numIfs = [ "zero", "one", "two" ];
  const numLoops = [ "zero", "one", "two" ];
  const hasHelperFunction = Math.random() >= 0.5; // 50/50 chance of asking for a helper function

  // configure code structure 
  const selectIfs = Math.floor(Math.random() * numIfs.length);
  const selectLoops = Math.floor(Math.random() * numLoops.length);
  prompt += "- The code must contain " + numIfs[selectIfs] + " conditional statement(s).\n";
  prompt += "- The code must contain " + numLoops[selectLoops] + " loop clause(s).\n";
  if (hasHelperFunction) {
    prompt += "- The code must contain one helper function.\n";
  }  
  prompt += "- The code MUST contain AT LEAST ONE helper function.\n";
  prompt += "- You must NOT call that helper function later.\n";
  prompt += "- The code must have only one output, and it must be printed to console at the end of the code.\n";
  prompt += "- The code must be limited to at most 20 lines of code, not including comments.\n"

  // set out the rules for the generated code (more like suggestions, the API may never follow these)
  // these exist just in hope of minimizing the chance the code breaking (Needs discussion)
  prompt += "The generated code must satisfy the following requirements:\n";
  prompt += "- The generated code must run without any syntax/runtime error.\n";
  prompt += "- Any indentation made in the code must be done using tab characters.\n";
  prompt += "- The generated code must not contain any two or more consecutive newline characters.\n";

  // set out the response format
  prompt += "Format the response using a JSON object witn the following attribute:\n";
  prompt += "- Code: The generated Python code.\n";
  prompt += "- Description: A brief description on what the code does.\n";
  prompt += "- ExpectedOutput: A brief description on the expected output of the code.\n"
  prompt += "- CSVName: If the code reads from a pre-existing CSV file, give the file name; otherwise, leave an empty string.\n";
  prompt += "- CSV: If the code reads from a pre-existing CSV file, give the content of the file; otherwise, leave an empty string.\n";

  return prompt;
}