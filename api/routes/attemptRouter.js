import express from 'express';
import attemptController from '../controller/questions/attemptController.js';
import questionController from '../controller/questions/questionController.js';
import userController from '../controller/user/userDataController.js';

const attemptRouter = express.Router();

// made an attempt! save it, then update analytics for both question and user.
attemptRouter.post('/submitAttempt', 
  attemptController.saveAttempt, 
  questionController.updateQuestionDetails, 
  userController.updateUserAnalytics
);

export default attemptRouter;