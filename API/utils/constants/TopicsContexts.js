
// containing all the relevant topics 
// TODO: create specific contexts for topics 

import { readFileSync } from 'fs';
// containing all the relevant topics 

import { promptDataFrame } from "./tasks/dataframeTasks.js";
import { promptNMI } from "./tasks/nmiTasks.js";
import { promptNLTK } from "./tasks/nltkTasks.js";
import { promptCorr } from "./tasks/corrTasks.js";
import { promptLR } from "./tasks/lrTasks.js";
import { promptDTree } from "./tasks/dTreeTasks.js";
import { promptCSV } from "./tasks/csvTasks.js";

export const TOPICS = {
  DataFrames: "Data Frame",
  NMI: "Normalised Mutual Information",
  NLTK: "Sentence splitting using nltk",
  Correlation: "Correlation",
  LinearRegression: "Linear Regression",
  DecisionTree: "Decision Tree Classifier",
  CSV: "Reading/Writing CSV files using Pandas"
};

export const topicsList = [
  'DataFrame',
  'NMI (Normalised Mutual Information)',
  'Sentence splitting using nltk (i.e. nltk.sent_tokenize())',
  'Correlation',
  'Linear Regression',
  'Decision Tree Classifier',
  'Reading/Writing CSV files'
]
export const SUBTOPICS = new Map([
  [TOPICS.DataFrames, [ 
    "Creating/Reading/Writing data frames", 
    "Indexing/Selecting/Assigning rows and columns", 
    "Summary Functions and Maps", 
    "Grouping and Sorting", 
    "Data Types and Missing Values", 
    "Renaming and Combining"
  ]],
  [TOPICS.CSV, [
    "Creating/Reading/Writing CSV files", 
    "Indexing/Selecting/Assigning rows and columns"
  ]], 
  [TOPICS.Correlation, [
    "Correlation matrix creation", 
    "Selecting n-most relevant labels"
  ]], 
  [TOPICS.LinearRegression, [
    "Predicting values using Linear Regression Model", 
    "Model Evaluation with Mean Squared Error", 
    "Model Evaluation with Root Mean Squared Error", 
    "Model Evaluation with Mean Absolute Error"
  ]], 
  [TOPICS.DecisionTree, [
    "Predicting values using Decision Tree Classifier Model",
    "Model evaluation with Accuracy", 
    "Model evaluation with Precision", 
    "Model evaluation with Recall", 
    "Model evaluation with F1-score" 
  ]], 
  [TOPICS.NMI, [
    "Measuring clusterings' mutual information using normalized_info_score"
  ]], 
  [TOPICS.NLTK, [
    "Lemmatization", 
    "Stemming", "Tokenization"
  ]]
]);

/**
 * Based on the topic requested from the front-end side, 
 * find the topic contextually closest using Levenshtein distance.
 * There is a realistic chance that the naming of the topics in the front-end
 * is different than the topic string constants in the backend, this might come in handy.
 * @param {string} topic 
 * @returns {string} The topic closest to the given request
 */
export function findClosestTopic(findTopic) {
  let editMin = Infinity;
  let res = null;
  let topics = Object.values(TOPICS);
  
  topics.forEach(t => {
    let edit = editDistance(findTopic, t);
    if (edit < editMin) {
      res = t;
      editMin = edit;
    }
  });

  return res;
}

/**
 * Fuzzy matching: Returns the edit distance between 2 strings using
 * Levenshtein distance.
 * @param {string} s1 
 * @param {string} s2 
 * @returns {number} The edit distance between 2 strings
 */
function editDistance(s1, s2) {
  let m = s1.length;
  let n = s2.length;
  
  // the mother of all edge cases
  if (m === 0 || n === 0) {
    // equivalent of (m == 0) -> ret n; (n == 0) -> ret m;
    return m + n;
  }

  // create the dp table
  let dp = []
  for (let i = 0; i < m + 1; ++i) {
    let row = []
    for (let j = 0; j < n + 1; ++j) {
      row.push(0);
    }
    dp.push(row);
  }
  for (let i = 0; i < n + 1; ++i) {
    dp[0][i] = i;
  }
  for (let i = 0; i < m + 1; ++i) {
    dp[i][0] = i;
  }

  // string matching
  for (let i = 1; i <= m; ++i) {
    for (let j = 1; j <= n; ++j) {
      if (s1[i-1] === s2[j-1]) {
        dp[i][j] = dp[i-1][j-1];
      }
      else dp[i][j] = 1 + Math.min( dp[i-1][j-1], dp[i][j-1], dp[i-1][j] );
    }
  }

  return dp[m][n];
}

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
export function generatePrompt(topic, context) {
 let prompt = "Generate a piece of Python code with the following specifications:\n";

    switch (topic) {
      case "DataFrame":
        prompt += "The DataFrames in the code should contain some None values\n";
        prompt += promptDataFrame(); 
        break;
      case "NMI (Normalised Mutual Information)":
        prompt += promptNMI();
        break;
      case "Sentence splitting using nltk (i.e. nltk.sent_tokenize())":
        prompt += promptNLTK(context);
        break;
      case "Correlation":
        prompt += promptCorr();
        break;
      case "Linear Regression":
        prompt += "- The data used should not have any null values.\n";
        prompt += promptLR();
        break;
      case "Decision Tree Classifier":
        prompt += "- The data used should not have any null values.\n";
        prompt += promptDTree();
        break;
      case "Reading/Writing CSV files":
        prompt += promptCSV();
        break;
      default:
        prompt += "- The code must be about " + topic + "\n";
    }
    
    prompt += "- The code must also have the context of " + context + "\n";
    
    // code formatting requirements
    prompt += "- The code must not contain any lines of comments or explanations in the code\n"; 
    prompt += "- The code must be at least 20 lines long, excluding any empty lines\n";
    prompt += "- Generate a different response from everything in this chat history.\n";

    prompt += "Format the response in JSON format with the following attributes:\n";

    // response requirements
    prompt += "- Code: The generated piece of code, ensuring you include the necessary tab characters\n";
    prompt += "- Description: a brief description on what the code does, if the code has multiple print statements, the description should specify the order in which they are printed\n";
    prompt += "- ExpectedOutput: a brief description on what the code should output\n";
    prompt += "- CSVName: If the code involves opening and reading a file, generate the name of the file\n";
    prompt += "- CSV: If the code involves opening and reading a file, generate an example of the file content\n";

    return prompt;
}
