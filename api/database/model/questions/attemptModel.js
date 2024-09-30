const AttemptSchema = new mongoose.Schema({
  attemptID: {
    type: Number, 
    required: true
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
    default: 0
  },
  correct: {
    type: Boolean,
    default: false
  },
  
});

export default AttemptSchema; 