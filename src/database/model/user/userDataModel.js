import attemptSchema from './attemptModel.js';

export default UserDataSchema = {
  userID: Number,
  timeAverage: Number,
  attempts: [attemptSchema],
  numAttempts: Number,
}