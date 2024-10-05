import express from 'express';
import userController from '../controller/user/userDataController.js';

const userRouter = express.Router();

// gets user data of the user
userRouter.get('/userData', userController.getUserData);

export default userRouter;