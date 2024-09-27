/*
Pearsons, Kendall, Spearman
calculating without libraries, with numpy, scipy, pandas
 */

/*-------------------------CREATING TASKS FOR GEMINI IN THE CORRELATION TOPIC------------------------*/
let corrMethods = [];
corrMethods.push("Pearson's Correlation");
corrMethods.push("Kendall's Correlation");
corrMethods.push("Spearman's Correlation");

let calcMethods = [];
calcMethods.push("without any Python libraries");
calcMethods.push("using only the numpy Python library");
calcMethods.push("using only the scipy Python library");
calcMethods.push("using only the pandas Python library");
/*---------------------------------------------------------------------------------------------------*/

export function promptCorr() {
  let taskOneCorr = Math.floor(Math.random() * corrMethods.length);
  let taskOneCalc = Math.floor(Math.random() * calcMethods.length);
  let str = "- It should calculate ";
  str += corrMethods[taskOneCorr] + calcMethods[taskOneCalc] + "\n";
  return str;
}
