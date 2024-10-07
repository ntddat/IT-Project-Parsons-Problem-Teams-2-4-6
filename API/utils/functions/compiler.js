import { PythonShell } from 'python-shell';
import { writeFile } from 'fs';

/*
export function syntaxCheck(code) {

  // Writing the generated code snippet to a Python script (to run through interpreter)
  writeFile("script.py", code, 'utf-8', function(err) {
    if (err) {
      throw new Error("Creating python script failed!");
    }
    else {
      console.log("\nCreating python script succeeded!\n");
    }
  });

  /**CHECK WITH DAT SHOULD WE USE A TRY CATCH BLOCK HERE ##
   * Implementing the below commented try catch block introduced an error
   * which I didn't understand so is it necessary to include?
   */
  // Running the response through python interpreter
  //try {
    // let pyShell = new PythonShell("script.py", { mode: 'text' });

    // // Printing the output
    // pyShell.on('message', function(message) {
    //   console.log("Output: " + message);
    // });
  // } catch (error) {
  //   throw new Error("Failed to run gemini's python response through interpreter");
  // }
  
  
//  return new Promise(function(resolve, reject) {
//    // End the input stream and allow the process to exit
//    pyShell.end(function(err, code, signal) {
//      console.log('The exit code was: ' + code);
//      console.log('The exit signal was: ' + signal);
//      console.log('finished');
//      if (err) {
//        console.error("The error is:\n" + err);
//        resolve(false);
//      }
//      else {
//        console.log("gemini's python code run successfully!\n");
//        resolve(true);
//      }
//
//    });
//  });
//}
//*/

export function syntaxCheck(code) {

  // return new Promise(function(resolve, reject) {
  //   PythonShell.runString(code, null).then(messages=>{
  //     resolve(true);
  //   })
  //   .catch(err=>{
  //     console.log(err);
  //     resolve(false);
  //   });
  // });

  return new Promise(function(resolve, reject) {
    // End the input stream and allow the process to exit
    pyShell.end(function(err, code, signal) {
      console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
      console.log('finished');
      if (err) {
        console.error("The error is:\n" + err);
        resolve(false);
      }
      else {
        console.log("gemini's python code run successfully!\n");
        resolve(true);
      }
      
    });
  });
}

export function createCSV(csvStr, csvName) {
  // If no CSV files are used by the generated code
  if ((typeof csvStr == "string" && csvStr.length == 0) || 
    (csvStr == null) || (csvStr == 'null') || (csvStr == 'Null') ||
    (csvStr == 'none') || (csvStr == 'None')) {
    return;
  }

  // Creating the CSV file used by the code
  writeFile(csvName, csvStr, 'utf8', function (err) {
    if (err) {
      console.error("Creating CSV file failed!");
      throw new Error("Creating CSV file failed!");
    }
    else {
      console.log("Creating CSV file succeeded!");
    }
  });
}
