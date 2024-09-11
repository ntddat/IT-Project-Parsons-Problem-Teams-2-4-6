export default AttemptSchema = new mongoose.Schema({
  attemptID: {
    type: Number, 
    required: true
  },
  questionID: {
    type: Number,
    required: true
  },
  userID: {
    type: Number,
    required: true
  },
  time: {
    type: Number,
    default: 0
  },
  answer: String,
  correct: {
    type: Boolean,
    default: false
  },
});