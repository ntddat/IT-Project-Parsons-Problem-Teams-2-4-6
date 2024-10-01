import express from 'express';
import questionController from '../controller/questions/questionController';

// Routes posts and get requests
const router = express.Router();

// send answers to the problems page
router.post('/generateQuestion', questionController.generateQuestion);

export default router;