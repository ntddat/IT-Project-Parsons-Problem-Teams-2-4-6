import askGemini from "../../service/askGemini.js";
import dotenv from 'dotenv';
import questionService from "../../service/questions/questionsService.js";
import httpCodes from "../../utils/constants/httpsCodes.js";

dotenv.config();

function getDbName() {
  const dbName = process.env.QUESTIONS_DATABASE;
  if (!dbName) {
    throw new Error("Database name is not defined in env file");
  }
  return dbName;
}

// Uses askGemini to generate a question based on the topic and context
const questionController = {
  // Generates a question based on the topic and context provided
  // Request: { topic, context }
  // Response: { success, message, questionID, question }
  generateQuestion: async (req, res) => {
    try {
      const { topic, context } = req.body; // Destructure the topic and context from req.body
  
      if (!topic && !context) {
        return res.status(httpCodes.BAD_REQUEST).json({
          success: false,
          message: "Please provide a topic and context"
        })
      }
    
      const dbName = getDbName();
    
      const questionID = await questionService.generateNewQuestionID(dbName);
      const question = await askGemini(topic, context);

      // save this question to the database
      const saveResult = await questionService.saveNewQuestion(topic, context, dbName);
      if (!saveResult.success) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: saveResult.message
        });
      }
    
      return res.status(httpCodes.OK).json({
        success: true,
        message: "Question generated successfully",
        questionID: questionID,
        question: question
      });

    } catch (e) {
      console.error("Error generating question:", e);
      return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: e.message
      });
    }
  },

  // Updates the question details based on the user's attempt
  // Request: { questionID, time, correct }
  // Response: { success, message }
  updateQuestionDetails: async (req, res) => {
    try {
      const { questionID, time, correct } = req.body; // Destructure the questionID, time and correct from req.body
      if (!questionID || !time || correct === undefined) {
        return res.status(httpCodes.BAD_REQUEST).json({
          success: false,
          message: "Please provide a questionID, time and correct"
        });
      }
    
      const dbName = getDbName();
    
      const updateResult = await questionService.updateQuestionDetails(questionID, time, correct, dbName);
      if (!updateResult.success) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: updateResult.message
        });
      }
      // next one in the middleware chain (this is actually a middleware!)
      next();

    } catch (e) {
      console.error("Error updating question details:", e);
      return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: e.message
      });
    }
  },

  runPythonCode: async (req, res) => {
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
      }).catch(err => {
        res.status(500).json({ error: err.message }); // Send any errors back to the client
      }
    );
  },
}

export default questionController;