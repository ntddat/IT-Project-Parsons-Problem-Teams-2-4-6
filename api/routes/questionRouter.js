import express from 'express';
import questionController from '../controller/questions/questionController.js';

// Routes posts and get requests
const questionRouter = express.Router();

// send answers to the problems page
questionRouter.post('/generateQuestion', questionController.generateQuestion);
questionRouter.post('/runPython', questionController.runPython);

export default questionRouter;