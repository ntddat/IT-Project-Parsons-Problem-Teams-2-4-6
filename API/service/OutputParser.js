/**    
  * @function outputParserJson    
  * Takes the response from Gemini API, presumably in the format
  * ```json```, it will return an object of 3 strings, being the code,
  * code description, and the optional example CSV file in text if applicable
  * respectively. If the output is not in the correct format, the function 
  * will throw an "Invalid output format" exception.
  */

export function outputParserJson(output) {
  const regexJsonParser = /```json\n([\s\S]*?)```/g;
  let doParse = regexJsonParser.exec(output);
  if (doParse === null) {
    throw messages.INVALID_OUTPUT_FORMAT;
    
  }
  let parsedData = doParse[1];
  parsedData = JSON.parse(parsedData); 
  //parsedData.Code = replaceSpacesWithTabs(parsedData.Code);
  //parsedData.Code = processString(parsedData.Code);
  return parsedData;
}

//THIS FUNCTION WAS GENERATED WITH CHATGPT
export function replaceSpacesWithTabs(inputString) {
  let result = '';
  let insideBrackets = false;
  let bracketsStack = [];
  const openingBrackets = ['(', '{', '['];
  const closingBrackets = [')', '}', ']'];

  for (let i = 0; i < inputString.length; i++) {
    let char = inputString[i];
    
    // Track whether we are inside parentheses (), curly braces {}, or square brackets []
    if (openingBrackets.includes(char)) {
      bracketsStack.push(char);
      insideBrackets = true;
    } else if (closingBrackets.includes(char)) {
      bracketsStack.pop();
      insideBrackets = bracketsStack.length > 0;
    }

    // Detect 4 spaces outside any bracket
    if (!insideBrackets && inputString.slice(i, i + 4) === '    ') {
      result += '\t';  // Add a tab character to the result
      i += 3;          // Skip the next 3 spaces, as we've already replaced them
    } else {
      result += char;  // Otherwise, add the current character to the result
    }
  }

  return result;
}

/**
 * @function processString
 * @param {*} string 
 * Filters out comments
 * Filters out any \n followed by spaces, tabs or \n and uses that to mark the start of a new instruction
 * Accounts for print statements containing \n
 * Also accounts for {}, [] and () containing \n
 * Accounts for ''' comments
 * @returns An array of strings where each string corresponds to a line of python
 * code to be parsed to the interactive problem
 */

export function processString(string) {
  let commentFlag = false;
  let commentFlag2 = false;
  let endCommentString = '';
  let acceptNewLines = true;
  let acceptNewLines2 = true;
  let newLineFlag = false;

  let insideBrackets = false;
  let bracketsStack = [];
  const openingBrackets = ['(', '{', '['];
  const closingBrackets = [')', '}', ']'];
  //if true then parser will add a new array element
  let nextLineFlag = false;
  let codeArray = [];
  let currentChar = '';
  let tabCount = 0;

  for (let i = 0; i < string.length; i++) {
    currentChar = string[i];
    //Assuming comments end in a newline character
    //Also assuming that the ai doesn't write code on the same line as a comment following the comment
    if (!commentFlag && !commentFlag2) {
      if (currentChar == "#") {
        commentFlag = true;
      } else if (currentChar == "'" && i < string.length - 2 && string[i+1] == "'" && string[i+2] == "'") {
        commentFlag = true;
      } else if (currentChar == '"' && i < string.length - 2 && string[i+1] == '"' && string[i+2] == '"') {
        commentFlag = true;
      }
    } else {
      if (currentChar == "\n" && !insideBrackets) {
        commentFlag = false;
        nextLineFlag = true;
        //To ensure we don't count too many tabs
        tabCount = 0;
      }
    }

    //To handle comments like ''' and """
    if (!commentFlag2 && !commentFlag2) {
      if (currentChar == "'" && i < string.length - 2 && string[i+1] == "'" && string[i+2] == "'") {
        commentFlag2 = true;
        endCommentString = "'";
        i += 2;
        continue;
      } else if (currentChar == '"' && i < string.length - 2 && string[i+1] == '"' && string[i+2] == '"') {
        commentFlag2 = true;
        endCommentString = '"';
        i += 2;
        continue;
      }
    } else {
      if (currentChar == endCommentString && i < string.length - 2 
        && string[i+1] == endCommentString && string[i+2] == endCommentString) {
        commentFlag2 = false;
        nextLineFlag = true;
        i += 2;
        //To ensure we don't count too many tabs
        tabCount = 0;
        continue;
      }
    }

    //Doesn't handle multiple embedded quotation marks ie: "'""'"
    //For when a new line character appears within a print statement
    // eg ("Number of cats:\n)
    if (acceptNewLines) {
      if (currentChar == "'") {
        acceptNewLines = false;
      }
    } else {
      if (currentChar == "'") {
        acceptNewLines = true;
      }
    }
    if (acceptNewLines2) {
      if (currentChar == '"') {
        acceptNewLines2 = false;
      }
    } else {
      if (currentChar == '"') {
        acceptNewLines2 = true;
      }
    }

    //Also checks to see if within brackets ({[]}), note this can handle multiple embedded 
    //brackets since Open brackets have a corresponding closing bracket unlike quotes
    if (openingBrackets.includes(currentChar) && !commentFlag && !commentFlag2) {
      bracketsStack.push(currentChar);
      insideBrackets = true;
    } else if (closingBrackets.includes(currentChar)) {
      bracketsStack.pop();
      insideBrackets = bracketsStack.length > 0;
    }

    //If we're currently processing over a new line count the tabs so we know how
    //many to append to the start of the instruction
    if (newLineFlag) {
      if (currentChar == '\t') {
        tabCount++;
      }
      if (currentChar != ' ' && currentChar != '\n' && currentChar != '\t') {
        newLineFlag = false;
        nextLineFlag = true;
      }
    } else {
      //If a new line character is actually at the end of a line of code, not after a comment
      //not within some eg "string\n" and not between some brackets eg {entry1: 1,\nentry2: 2}
      //Then it marks a new instruction
      if (currentChar == '\n' && acceptNewLines && acceptNewLines2 && !insideBrackets) {
        newLineFlag = true;
        tabCount = 0;
      }
    }

    //If we're not processing over a new line then append the character
    //If it's the first character of an instruction then need to append the appropriate number of tabs
    if (!newLineFlag && !commentFlag && !commentFlag2 && (nextLineFlag == true || codeArray.length == 0)) {
      if (tabCount > 0) {
        codeArray.push('\t');
        for (let i = 0; i < tabCount - 1; i++) {
          codeArray[codeArray.length - 1] += '\t';
        }
        codeArray[codeArray.length - 1] += currentChar;
      } else {
        codeArray.push(currentChar);
      }
      
      nextLineFlag = false;

    //Also want to ignore new line characters within dictionaries.
    //We used to pass a code array to the front end but at some point
    //That changed to a string (array.join('\n')) Which means if we leave new line characters
    //On the end of a dictionary within a given array element they will be displayed as 
    //Separate code blocks on the front end
    } else if (!newLineFlag && !commentFlag && !commentFlag2
              && !(currentChar == '\n' && insideBrackets)) {
      codeArray[codeArray.length - 1] += currentChar;
    }
  }
  return codeArray;
}

/**
 * @function checkUnusedFunctions
 * @param {*} string 
 * Checks if the code gemini generated defines any functions that aren't subsequently used
 * MAKES THE ASSUMPTION THAT IF THE FUNCTION NAME APPEARS TWICE AND THE CODE IS SYNTACTICALLY CORRECT
 * THEN THE FUNCTION MUST BE CALLED AT LEAST ONCE
 * 
 * ^This fails if a function name is a substring of another
 * 
 * It first identifies the names of all defined functions. Then it matches for strings that don't
 * start with def and aren't included within '' and "". Then 
 * This does not account for the possibility of a function call beingincluded within
 * An if statement that may or may not be used. 
 * @returns The function name of unused function or false if all functions used
 */

export function checkUnusedFunctions(pythonCode) {
  let defFlag = false;
  let functionName = "";
  let lookForCalls = [];
  //make a list of names of defined functions
  for (let i = 0; i < pythonCode.length - 3; i++) {
    if (!defFlag && pythonCode[i] == "d" && pythonCode[i+1] == "e" && pythonCode[i+2] == "f" &&
        (pythonCode[i+3] == " " || pythonCode[i+3] == "\t")
    ) {
      defFlag = true;
      i = i + 2;
      continue;
    }

    //Look for the end of a function name
    if (defFlag && (pythonCode[i] == "(")) {
      defFlag = false;
      lookForCalls.push(functionName);
      functionName = "";
    }

    //If we just saw a def then start building function name
    if (defFlag && pythonCode[i] != " "){
      functionName = functionName + pythonCode[i];
    }
  }


  for (let i = 0; i < lookForCalls.length; i++) {
    let functionName = lookForCalls[i];
    let r =pythonCode.indexOf(functionName);
    let count = 0;
    let endOfName = 0;
    while (r != -1) {
      //only increment count if the function name isn't a substring of another
      endOfName = r + lookForCalls[i].length;
      if (pythonCode[endOfName] == " " || pythonCode[endOfName] == "(" || pythonCode[endOfName] == "," || pythonCode[endOfName] == "\n") {
        count++;
      }
      r = pythonCode.indexOf(functionName, r + 1);        
    }

    //If a function name appears once then it was only defined and never called
    if (count < 2) {
      return lookForCalls[i];
    }
  }
  //All function names appeared atleast twice so we assume all functions were called
  return false;

}
