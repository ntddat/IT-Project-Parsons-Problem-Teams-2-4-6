import express from 'express';
import adminController from '../controller/user/adminController';

const router = express.Router();

router.get('/summary', adminController.summariseInfo);