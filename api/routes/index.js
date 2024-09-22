import express from 'express';

// Routes posts and get requests
const router = express.Router();


// send answers to the problems page
router.get('/info', (req, res) => {
  res.status(200).json({info: answer})
})


