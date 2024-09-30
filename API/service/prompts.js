import { TOPICS, SUBTOPICS } from "../utils/constants/TopicsContexts.js"; // access topics for generation

/**
 * Given a topic and a context, generate a prompt that, when fed into the Gemini API, will
 * return a piece of Python code, along with any additional resources it may require.
 * @param {string} topic 
 * @param {string} context 
 * @returns The prompt to be fed into Gemini API
 */
export function generatePrompt(topic, context) {
  
  if (Object.values(TOPICS).indexOf(topic) === -1) {
    throw "Invalid topic passed";
  }
  
  let prompt = "With the topic of \"" + topic + "\" and context \"" + context + "\", follow these steps:\n";
  
  let coreTechniqeIndex = Math.floor(Math.random() * SUBTOPICS.get(topic).length);
  let coreTechniqe = SUBTOPICS.get(topic)[coreTechniqeIndex];


  // The data will be generated before the code does, and we will make it such that the code adheres strictly
  // to said data. This is to minimize the chance of code trying to access elements that don't exist in the data

  // since NLTK works with a different form of data, consider it seperately
  if (topic === TOPICS.NLTK) {
    prompt += "- Create a Python string relating to tne given context.\n"
    prompt += "- Generate a piece of Python code using the created string using the core technique: \"" + coreTechniqe + "\".\n";
  } else {
    prompt += "- Create a Python Dictionary or an external CSV file dense with numeric data of the given topic, the create a dataset based on the data.\n";
    prompt += "- Generate a piece of Python code using the created dataset using the core technique: \"" + coreTechniqe + "\".\n";
  }

  // randomly selecting elements
  // due to the process of tokenization in LLM, these kinds of model are terrible at understanding numeric value, 
  // so i figure it would be better if we translate these to English representations
  const numIfs = [ "zero", "one", "two", "three", "four", "five" ];
  const numLoops = [ "zero", "one", "two", "three" ];
  const hasHelperFunction = Math.random() >= 0.5; // 50/50 chance of asking for a helper function

  // configure code structure 
  const selectIfs = Math.floor(Math.random() * numIfs.length);
  const selectLoops = Math.floor(Math.random() * numLoops.length);
  prompt += "- The code must contain " + numIfs[selectIfs] + " conditional statement(s).\n";
  prompt += "- The code must contain " + numLoops[selectLoops] + " loop clause(s).\n";
  if (hasHelperFunction) {
    prompt += "- The code must contain one helper function.\n";
  }  
  prompt += "- The code must have only one output, and it must be printed to console at the end of the code.\n";
  
  // set out the rules for the generated code (more like suggestions, the API may never follow these)
  // these exist just in hope of minimizing the chance the code breaking (Needs discussion)
  prompt += "The generated code must satisfy the following requirements:\n";
  prompt += "- The generated code must run without any syntax/runtime error.\n";
  prompt += "- The generated code must not contain any comment.\n";
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