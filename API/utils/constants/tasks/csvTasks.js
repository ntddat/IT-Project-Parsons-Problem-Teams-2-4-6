
/*-------------------------------CREATING TASKS FOR GEMINI IN THE CSV TOPIC----------------------------*/

let taskCSVRead = [];
taskCSVRead.push("- Read a CSV file using the pandas library, and use it to create a DataFrame.\n");
taskCSVRead.push("- Read a CSV file without using the pandas library, and use it to create a DataFrame.\n");

let taskCSVWrite = [];
taskCSVWrite.push("- Create a DataFrame and write its content to a CSV file using the pandas library.\n");
taskCSVWrite.push("- Create a DataFrame and write its content to a CSV file without using the pandas library.\n");

let taskCSVBoth = [];
taskCSVBoth.push("- Read a CSV file using the pandas library, use it to create a DataFrame, and write the contents of the DataFrame to a new CSV file.\n");
taskCSVWrite.push("- Create a DataFrame, write its content to a CSV file, and read that CSV file into a new DataFrame.\n");

let tasksCSV = [];
tasksCSV.push(taskCSVRead);
tasksCSV.push(taskCSVWrite);

/*---------------------------------------------------------------------------------------------------*/

export function promptCSV() {
  let readWrite = Math.floor(Math.random() * tasksCSV.length);

  let randomTask = Math.floor(Math.random() * tasksCSV[readWrite].length);

  return tasksCSV[readWrite][randomTask];

}
