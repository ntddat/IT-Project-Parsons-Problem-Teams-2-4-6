import express from 'express';
import generateQuestion from '../controller/questionController.js';

// Routes posts and get requests
const frontendRouter = express.Router();

// send answers to the problems page
backendRouter.get('/problem', generateQuestion);

export default backendRouter;