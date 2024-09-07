
// containing all the relevant topics 
// TODO: create specific contexts for topics 

const fs = require('fs');

// Having topic-specific tasks (outdated probably)
/*
let taskListDF = [];
taskListDF.push(" create a new column and create values for it from existing columns in a DataFrame.");
taskListDF.push(" sort the DataFrame over multiple columns.");
taskListDF.push(" use groupby and sum on the original DataFrame, and print the grouped DataFrame.");
taskListDF.push(" use groupby and count on the original DataFrame, and print the grouped DataFrame.");
taskListDF.push(" use groupby and mean on the original DataFrame, and print the grouped DataFrame.");
taskListDF.push(" use groupby and median on the original DataFrame, and print the grouped DataFrame.");
taskListDF.push(" use groupby and mode on the original DataFrame, and print the grouped DataFrame.");
taskListDF.push(" join two DataFrames and print the joined DataFrame.");

function promptDataFrame() {
  let promptDF = "";

  promptDF += "It should create a pandas series first, then use those series to create a DataFrame.\n";

  promptDF += " - It should then";
  promptDF += taskListDF[Math.floor(Math.random() * taskListDF.length)];

  return promptDF;
}
*/

// Reading example code snippets into a string
let data = fs.readFileSync("DataFrameSnippets.txt", "utf-8");

module.exports = {
  TOPICS : {
  
    DataFrames : "Data Frames", 
    NMI : "Normalized Mutual Information", 
    NLTK: "Sentence Splitting using NLTK", 
    Correlation : "Correlation", 
    LinearRegression : "Linear Regression", 
    DecisionTree : "Decision Tree", 
    CSV : "Read/Write CSV File"
  
  },

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
  generatePrompt : function(topic, context) {
    let prompt = "Generate a piece of Python code with the following specifications, and give the 3 drafts answers as well:\n";
    
    if (topic == "DataFrame") {
      //prompt += promptDataFrame();
      //console.log(prompt);
      //prompt += "- It should be similar to the following code snippets:\n";
      prompt += "- Your response should be similar to the following examples, especially Example 1:\n";
      prompt += data;
      prompt += "\n";
      //prompt += "- If the code uses fillna(), the DataFrames must contain None values\n";
      prompt += "The DataFrames in the code should contain some None values\n";
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
}

 
