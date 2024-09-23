const UserSchema = new Schema({
  userID: { type: Number, required: true },
  attemptsSummary: [
    {
      topic: { type: String, required: true },
      numAttempts: { type: Number, required: true },
      numCorrect: { type: Number, required: true },
      
    },
  ],
});