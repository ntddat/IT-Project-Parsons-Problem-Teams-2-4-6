import express from 'express';
import userController from '../controller/user/userDataController';

const router = express.Router();

// gets user data of the user
router.get('/user', userController.getUserData);

export default router;