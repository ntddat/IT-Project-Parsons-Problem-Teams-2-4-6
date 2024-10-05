import mongoose from "mongoose";
const { Schema } = mongoose;

const UserDataSchema = new Schema({
  cookieID: { type: Number, required: true , unique: true},
  name: {type: String, required: true, default: "Student"},
  // num attempts and percent correct for each topic
  accuracy: { type: Number, default: 0, required: true },
  numAttempts: { type: Number, default: 0, required: true },
  numCorrect: { type: Number, default: 0, required: true },
  attemptsSummary: [
    {
      topic: { type: String, required: true},
      numAttempts: { type: Number, default: 0, required: true },
      numCorrect: { type: Number, default: 0, required: true },
      accuracy: { type: Number, default: 0, required: true },
      totalTime: { type: Number, default: 0, required: true },
      attemptedQuestions: { type: [{ questionID: { type: Number, required: true }, }], default: [] },
    },
  ],
});

export default UserDataSchema;