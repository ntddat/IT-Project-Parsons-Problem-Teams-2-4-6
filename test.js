import askGemini from './API/service/askGemini.js';
import { writeFileSync } from 'fs';

let topic = [
  'Correlation',
  'DataFrame',
  'Decision Tree Classifier',
  'Linear Regression',
  'NMI (Normalised Mutual Information)',
  'Reading/Writing CSV files',
  'Sentence splitting using nltk (i.e. nltk.sent_tokenize())'
  ];

let context = [
  'Customer Purchase Behavior',
  'Global Temperature Trends',
  'Koala Population in Australia',
  'Predicting Disease Outbreaks',
  'Stock Market Prediction',
  'Student Performance Prediction',
  'Sales Forecasting',
  'Traffic Flow Analysis',
  'Inventory Management'
];
// Have to get backup: 0
// 20 seconds with no error and no missing function: 1
// 20 seconds with no error and missing function: 2
// 20 seconds with error and no missing function: 3
// 20 seconds with both: 4

let topicCounts = [];
let topicContextCounts = [];

for (let i = 0; i < topic.length; i++) {
  resetTopicCounts();
  for (let j = 0; j < context.length; j++) {
    resetTopicContextCounts();
    for (let k = 0; k < 10; k++) {
      let result = await askGemini(topic[i], context[j], 1, false, topicCounts, topicContextCounts);
      if (result.success === false) {
        k -= 1;
        await sleep(10000);
        continue;
      }
      console.log(result);
      topicCounts = result.topic;
      topicContextCounts = result.topicContext;
      console.log(topicContextCounts);
      console.log(topicContextCounts[1]);
      await sleep(10000);
    }
    let text = '';
    text += 'Had to get backup: ' + topicContextCounts[0].toString() + '\n';
    text += 'Under 20 seconds with no errors and no missing functions: ' + topicContextCounts[1].toString() + '\n';
    text += 'Under 20 seconds with no errors but missing functions: ' + topicContextCounts[2].toString() + '\n';
    text += 'Under 20 seconds with errors but no missing functions: ' + topicContextCounts[3].toString() + '\n';
    text += 'Under 20 seconds with both errors and missing functions: ' + topicContextCounts[4].toString() + '\n';
    if (topic[i] == 'Reading/Writing CSV files') {
      writeFileSync('./testLogs/topicContextLogs/ReadWrite CSV  and ' + context[j] + ".txt", text);
    }
    else {
      writeFileSync('./testLogs/topicContextLogs/' + topic[i] + ' and ' + context[j] + ".txt", text);
    }
    console.log(topicContextCounts);
    console.log("Topic Context done\n");
  }
  let text = '';
  text += 'Had to get backup: ' + topicCounts[0].toString() + '\n';
  text += 'Under 20 seconds with no errors and no missing functions: ' + topicCounts[1].toString() + '\n';
  text += 'Under 20 seconds with no errors but missing functions: ' + topicCounts[2].toString() + '\n';
  text += 'Under 20 seconds with errors but no missing functions: ' + topicCounts[3].toString() + '\n';
  text += 'Under 20 seconds with both errors and missing functions: ' + topicCounts[4].toString() + '\n';
  if (topic[i] == 'Reading/Writing CSV files') {
    writeFileSync('./testLogs/topicLogs/ReadWrite CSV.txt', text);
  }
  else {
    writeFileSync('./testLogs/topicLogs/' + topic[i] + ".txt", text);
  }
  console.log(topicCounts);
  console.log("Topic done\n");
}

function resetTopicCounts() {
  for (let i = 0; i < 5; i++) {
    topicCounts[i] = 0;
  }
}

function resetTopicContextCounts() {
  for (let i = 0; i < 5; i++) {
    topicContextCounts[i] = 0;
  }
}

function sleep(time) {
  return new Promise((resolve) => { 
    setTimeout(resolve, time);
  });
}
