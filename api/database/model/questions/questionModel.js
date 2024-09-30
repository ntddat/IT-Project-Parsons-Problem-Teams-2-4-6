const QuestionSchema = {
  questionID: {
    type: Number,
    required: true,
    unique: true
  },
  topic: {
    type: String,
    required: true
  },
  context: {
    type: String,
    required: true
  },
  correct: {
    type: Boolean,
    default: false,
    required: true,
  },
  totalTime: {
    type: Number,
    default: 0,
    required: true
  },
  averageTime: {
    type: Number,
    default: 0,
    required: true
  },
  numAttempts: {
    type: Number,
    default: 0,
    required: true
  },
}

export default QuestionSchema;