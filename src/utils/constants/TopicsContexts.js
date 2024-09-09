
// containing all the relevant topics 
// TODO: create specific contexts for topics 

import { readFileSync } from 'fs';

export const TOPICS = {
  DataFrames: "Data Frames",
  NMI: "Normalized Mutual Information",
  NLTK: "Sentence Splitting using NLTK",
  Correlation: "Correlation",
  LinearRegression: "Linear Regression",
  DecisionTree: "Decision Tree",
  CSV: "Read/Write CSV File"
};

/**
* @function generatePrompt
* This function generates a prompt based on the topic  
* passed as the parameter. The prompt will then be sent to 
* the Gemini API to generate a piece of code, along with the 
* description and the example dataset if applicable
*
* The context of the prompt should be randomly generated based 
* on each individual context 
* 
* TODO: discuss whether the prompt should ask for JSON formatted response
* or just plain response 
*/

// Write examples for read/write csv files
// Do original idea, add stuff from current examples

/*
Step 1: Creating DataFrame
- Create some Pandas series and use them to create a DataFrame
- Create three Pandas DataFrame and join them using concat
- Create a python dictionary and use it to create a DataFrame
Step 2:
- The DataFrame must contain null values
Step 3: fillna

*/

let createDF = [];
createDF.push(" create 3 Pandas series and use them to create a Pandas DataFrame.\n");
createDF.push(" create 3 Pandas DataFrames and join them using concat.\n");
createDF.push(" create 3 Pandas DataFrames and join them using join.\n");
createDF.push(" create 3 Pandas DataFrames and join them using merge.\n");
createDF.push(" create a Python dictionary and use it to create a Pandas DataFrame.\n");

let tasks = new Map();

let taskDFSort = [];
taskDFSort.push(" sort the DataFrame over multiple columns in ascending order.\n"); 
taskDFSort.push(" sort the DataFrame over multiple columns in descending order.\n"); 

let taskDFGroupby = [];
taskDFGroupby.push(" use groupby and sum on the original DataFrame, and print the grouped DataFrame.\n");
taskDFGroupby.push(" use groupby and count on the original DataFrame, and print the grouped DataFrame.\n");
taskDFGroupby.push(" use groupby and mean on the original DataFrame, and print the grouped DataFrame.\n");
taskDFGroupby.push(" use groupby and median on the original DataFrame, and print the grouped DataFrame.\n");
taskDFGroupby.push(" use groupby and mode on the original DataFrame, and print the grouped DataFrame.\n");
taskDFGroupby.push(" use groupby and agg on the original DataFrame, and print the grouped DataFrame.\n");

let taskDFJoin = [];
taskDFJoin.push(" create a new DataFrame, and perform a left join on it and the original DataFrame using keys from the original DataFrame, then print the resulting DataFrame.\n");
taskDFJoin.push(" create a new DataFrame and perform a join on it and the original DataFrame along rows and assign all data, then print the resulting DataFrame.\n");
taskDFJoin.push(" create a new DataFrame and perform a merge on it and the original DataFrame along their common column id, then print the resulting DataFrame.\n");
taskDFJoin.push(" create a new DataFrame and perform a join on it and the original DataFrame with matching records on both sides where available, then print the resulting DataFrame.\n");
taskDFJoin.push(" create a new DataFrame and perform a merge on it and the original DataFrame using multple join keys, then print the resulting DataFrame.\n");

let taskDFRegex = [];
taskDFRegex.push(" capitalize all string values of a column in the original DataFrame using regular expression.\n");
taskDFRegex.push(" count the number of occurrence of a specified substring in a column in the original DataFrame using regular expression.\n");
taskDFRegex.push(" remove all HTML tags in a column in the original DataFrame using regular expression.\n");
taskDFRegex.push(" extract date from a column in the original DataFrame using regular expression.\n");

let taskDFMissing = [];
taskDFMissing.push(" count the number of missing values in each column of the original DataFrame.\n");
taskDFMissing.push(" replace null values of the original DataFrame with a single constant value.\n");
taskDFMissing.push(" replace null values of the original DataFrame with a value from the previous or next row.\n");
taskDFMissing.push(" replace null values of the original DataFrame with the mean value of the column.\n");
taskDFMissing.push(" replace null values of the original DataFrame with the median value of the column.\n");

let taskDFSlicing = [];
taskDFSlicing.push(" select the first three rows from the original DataFrame using iloc.\n");
taskDFSlicing.push(" select rows from the original DataFrame based on a condition using loc.\n");
taskDFSlicing.push(" set values the original DataFrame using loc.\n");
taskDFSlicing.push(" slice the original DataFrame based on rows and columns labels using loc.\n");

tasks.set(0, taskDFSort);
tasks.set(1, taskDFGroupby);
tasks.set(2, taskDFJoin);
tasks.set(3, taskDFRegex);
tasks.set(4, taskDFMissing);
tasks.set(5, taskDFSlicing);

function promptDataFrame() {
  let taskOne = Math.floor(Math.random() * tasks.size);
  let taskTwo = Math.floor(Math.random() * tasks.size);
  let taskThree = taskOne;
  while (taskThree == taskTwo || taskThree == taskOne) {
    taskThree = Math.floor(Math.random() * tasks.size);
  }
  let str = "";
  str += "- It should";
  str += createDF[Math.floor(Math.random() * createDF.length)];
  let taskOneArr = tasks.get(taskOne);
  let taskTwoArr = tasks.get(taskTwo);
  let taskThreeArr = tasks.get(taskThree);
  console.log(taskOne);
  console.log(taskTwo);
  console.log(taskThree);
  str += "- It should then";
  str += taskOneArr[Math.floor(Math.random() * taskOneArr.length)];
  str += "- It should then";
  str += taskTwoArr[Math.floor(Math.random() * taskTwoArr.length)];
  str += "- It should then";
  str += taskThreeArr[Math.floor(Math.random() * taskThreeArr.length)];
  return str;
}

export function generatePrompt(topic, context) {
    let prompt = "Generate a piece of Python code with the following specifications, and give the 3 drafts answers as well:\n";
    
    if (topic == "DataFrame") {
      //prompt += promptDataFrame();
      //console.log(prompt);
     //prompt += "- It should be similar to the following code snippets:\n";
      /*
      let data = readFileSync("./src/utils/constants/DataFrameSnippets.txt", "utf-8");
      prompt += "- Your response should be similar to the following examples, especially Example 1:\n";
      prompt += data;
      prompt += "\n";
      */
      //prompt += "- If the code uses fillna(), the DataFrames must contain None values\n";
      prompt += "The DataFrames in the code should contain some None values\n";
      prompt += promptDataFrame();
    }
    else {
      prompt += "- The code must be about " + topic + "\n";
    }
    prompt += "- The code must also have the context of " + context + "\n";
    
    // code formatting requirements
    prompt += "- The code must not contain any lines of comments or explanations in the code\n"; 
    prompt += "- The code must be at least 40 lines long, excluding any empty lines\n";

    prompt += "Format the response in JSON format with the following attributes:";

    // response requirements
    prompt += "- Code: The generated piece of code\n";
    // prompt += "- Description: a brief description on what the code does\n";
    prompt += "- Description: a brief description on what the code does, if the code has multiple print statements, the description should specify the order in which they are printed\n";
    prompt += "- ExpectedOutput: a brief description on what the code should output\n";
    prompt += "- CSVName: If the code involves opening and reading a file, generate the name of the file\n";
    prompt += "- CSV: If the code involves opening and reading a file, generate an example of the file content\n";

    return prompt;
}
