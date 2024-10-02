import mongoose from "mongoose";
const { Schema } = mongoose;

const AttemptSchema = new Schema({
  attemptID: {
    type: Number, 
    required: true,
    unique: true
  },
  questionID: {
    type: Number,
    required: true
  },
  cookieID: {
    type: Number,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    default: 0,
    required: true
  },
  correct: {
    type: Boolean,
    default: false,
    required: true
  },
});

export default AttemptSchema; 