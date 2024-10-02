// TODO: SPLIT THIS INTO CONTROLLERM MIDDLEWARE, AND SERVICE
// Importing packages
import dotenv from 'dotenv';
import { PythonShell } from 'python-shell';
import express, { static as expressStatic, json } from 'express';
import format from 'string-format';
import cors from 'cors';
// Importing our modules
import { establishConnection } from './database/connection.js';
import router from './routes/index.js';

dotenv.config();
const app = express()

app.use(express.json());
app.use(cors());

// Establishing connection to the database
establishConnection();

// Constants
const port = 8383
var answer = "Haven't queried yet";

//Allows the server to see the index.html page in the public folder
//IN MERGING PROCESS CHANGED FROM PUBLIC TO SRC SO index.html can be in the same folder as main.js
app.use(expressStatic('App'))
//Expects to receive json in the app.post method
app.use(json())

app.get('app/problem', (req, res) => {
    res.status(200).json({info: answer})
})

app.post('/run-python', async (req, res) => {
  const { pythonCode } = req.body;

  if (!pythonCode) {
    return res.status(400).send('No Python code provided.');
  }

  // Options for PythonShell
 //let options = {
  //  mode: 'text',
  //  pythonPath: './venv/Scripts/python', // Change to 'python3' if needed
  //  pythonOptions: ['-u'],
  //  scriptPath: './'
  //};

  // Run the Python code
  PythonShell.runString(pythonCode) 
    .then(messages => {
      console.log(messages)
      messages = messages.join("\r\n");
      console.log(messages)
      res.json({ output: messages }); // Send the output back to the client
    })
    .catch(err => {
      res.status(500).json({ error: err.message }); // Send any errors back to the client
    });
});

app.use('/api', router);

app.listen(port, () => console.log(format("server has started on port: {}", port)))
