import express from 'express';
import generateQuestion from '../controller/questions/questionController.js';

// Routes posts and get requests
const router = express.Router();

// send answers to the problems page
router.route('/sendTopicContext').post(generateQuestion);

export default router;