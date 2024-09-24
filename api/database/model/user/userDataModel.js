const UserDataSchema = new Schema({
  cookieID: { type: Number, required: true },
  // num attempts and percent correct for each topic
  accuracy: { type: Number, required: true },
  numAttempts: { type: Number, required: true },
  numCorrect: { type: Number, required: true },
  attemptsSummary: [
    {
      topic: { type: String, required: true },
      numAttempts: { type: Number, required: true },
      numCorrect: { type: Number, required: true },
      accuracy: { type: Number, required: true },
      totalTime: { type: Number, required: true },
      averageTime: { type: Number, required: true },
    },
  ],
  attemptedQuestions: [
    { questionID: { type: Number, required: true }, },
  ]
});

export default UserDataSchema;