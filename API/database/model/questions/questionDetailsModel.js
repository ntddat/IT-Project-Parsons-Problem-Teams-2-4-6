const QuestionDetailsSchema = {
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
    required: true
  },
  totalTime: {
    type: Number,
    required: true
  },
  averageTime: {
    type: Number,
    required: true
  },
  numAttempts: {
    type: Number,
    required: true
  },
}

export default QuestionDetailsSchema;