import express from 'express';
import attemptController from '../controller/questions/attemptController';
import questionController from '../controller/questions/questionController';
import userController from '../controller/user/userDataController';

const router = express.Router();

// made an attempt! save it, then update analytics for both question and user.
router.post('/submitAttempt', 
  attemptController.saveAttempt, 
  questionController.updateQuestionDetails, 
  userController.updateUserAnalytics
);

export default router;