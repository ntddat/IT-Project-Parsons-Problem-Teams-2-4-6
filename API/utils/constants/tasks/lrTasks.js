
/*-----------------------CREATING TASKS FOR GEMINI IN THE LINEAR REGRESSION TOPIC--------------------*/

let taskLREvaluation = [];
taskLREvaluation.push(" evaluate the model by calculating its Mean Squared Error.\n");
taskLREvaluation.push(" evaluate the model by calculating its Root Mean Squared Error.\n");
taskLREvaluation.push(" evaluate the model by calculating its Mean Absolute Error.\n");

/*---------------------------------------------------------------------------------------------------*/

export function promptLR() {
  let task = Math.floor(Math.random() * taskLREvaluation.length);
  let str = "";
  str += "- It should predict values using the Linear Regression Model.\n";
  str += "- It should then";
  str += taskLREvaluation[task];

  return str;

}
