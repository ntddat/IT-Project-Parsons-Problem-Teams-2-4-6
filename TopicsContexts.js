
// containing all the relevant topics 
// TODO: create specific contexts for topics 

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
  generatePrompt : function(topic) {
    let prompt = "Generate a piece of Python code with the following specifications:\n";
    prompt += "- The code must be about " + topic + "\n";
    prompt += "- The code must not contain any comment\n"; 
    prompt += "- The code must not contain 2 or more consecutive newline characters\n";
    prompt += "- The code must be 10 lines long\n";
    prompt += "Format the response with the following attributes:";
    // prompt += "- Code: The generated piece of code\n";
    prompt += "- Description: a brief description on what the code does\n";
    prompt += "- Expected output: the expected output of the code\n";
    prompt += "- CSV: If the code involves opening and reading a file, generate an example of the file content";

    return prompt;
  }
}
