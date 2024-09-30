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
  generateQuestion: async (req, res) => {
    try {
      const { topic, context } = req.body; // Destructure the topic and context from req.body
  
      if (!topic && !context) {
        res.status(httpCodes.BAD_REQUEST).json({
          success: false,
          message: "Please provide a topic and context"
        })
      }
    
      const dbName = getDbName();
    
      const questionID = await questionService.generateNewQuestionID(dbName);
      const question = await askGemini(topic, context);
    
      res.status(httpCodes.OK).json({
        success: true,
        message: "Question generated successfully",
        questionID: questionID,
        question: question
      });
    } catch (e) {
      console.error("Error generating question:", e);
      res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: e.message
      });
    }
  },
  
  
}

export default questionController;