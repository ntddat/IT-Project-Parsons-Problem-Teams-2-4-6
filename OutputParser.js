module.exports = { 
  
  /**
    * @function outputParserJson
    *
    * Takes the response from Gemini API, presumably in the format
    * ```json```, it will return an object of 3 strings, being the code,
    * code description, and the optional example CSV file in text if applicable
    * respectively. If the output is not in the correct format, the function 
    * will throw an "Invalid output format" exception.
    */
  outputParserJson : function(output) {
    const regexJsonParser = /```json\n([\s\S]*?)```/g;   
    let doParse = regexJsonParser.exec(output);
    if (doParse === null) {
      throw "Invalid output format";
    }
    let parsedData = doParse[1];
    return JSON.parse(parsedData);
  }, 

  /**
    * @function outputParser
    * @param {string} output 
    * @return {Object}
    * 
    * Takes the response from Gemini API, presumably in the format as following:
    * ```python
    * ...
    * ```
    * 
    * Description:
    *
    * Expected Output:
    * 
    * Example CSV:
    *
    * The function will return an object of 3 strings, being the code, code description, 
    * and the optional example CSV file in text if applicable respectively. If the 
    * output is not in the correct format, the function will throw an "Invalid output format"
    * exception.
    */
  outputParser : function(output) {
    const regexCodeParser = /```python\n([\s\S]*?)```\n+(?:\*\*(.*?)\*\*\:)([\s\S]*?)(?=\n\*\*|$)/g;
    
    // extract the code of the response
    let parsedCode = regexCodeParser.exec(output);
    if (parsedCode === null) {
      throw "Parse error; the code cannot be extracted from the format";
    }
    
    return parsedCode;
  }
}
