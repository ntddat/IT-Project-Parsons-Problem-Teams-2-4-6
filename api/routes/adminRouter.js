import express from 'express';
import adminController from '../controller/adminController';

const router = express.Router();

router.route('/summary').get();