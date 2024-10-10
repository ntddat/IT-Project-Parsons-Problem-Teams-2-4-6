
/*------------------------------CREATING TASKS FOR GEMINI IN THE NMI TOPIC---------------------------*/

let taskNMI = [];
taskNMI.push("Calculate the Normalised Mutual Information of two features using scipy.\n");
taskNMI.push("Calculate the Normalised Mutual Information of two features without using any libraries.\n");
taskNMI.push("Calculate the entropy of two features using scipy, then use it to calculate the Normalised Mutual Information of these two features without using any libraries.\n");
taskNMI.push("Calculate the Normalised Mutual Information matrix for four features.\n");

/*---------------------------------------------------------------------------------------------------*/

export function promptNMI() {
  let nmiRandom = Math.floor(Math.random() * taskNMI.length);

  return taskNMI[nmiRandom];

}
