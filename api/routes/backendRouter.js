import express from 'express';
import generateQuestion from '../controller/generatorController.js';

// Routes posts and get requests
const backendRouter = express.Router();


// send answers to the problems page
backendRouter.post('/sendData', generateQuestion);

export default backendRouter;