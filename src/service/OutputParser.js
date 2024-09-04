import regex from "../utils/constants/regex.js";
import messages from "../utils/constants/messages.js";

/**    
  * @function outputParserJson    
  * Takes the response from Gemini API, presumably in the format
  * ```json```, it will return an object of 3 strings, being the code,
  * code description, and the optional example CSV file in text if applicable
  * respectively. If the output is not in the correct format, the function 
  * will throw an "Invalid output format" exception.
  */
export function outputParserJson(output) {
  // const regexJsonParser = /```json\n([\s\S]*?)```/g;
  let doParse = regex.REGEX_JSON_PARSER.exec(output);
  if (doParse === null) {
    throw messages.INVALID_OUTPUT_FORMAT;
    // throw "Invalid output format";
  }
  let parsedData = doParse[1];
  return JSON.parse(parsedData);
}
