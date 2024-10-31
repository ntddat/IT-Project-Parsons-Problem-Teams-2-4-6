import questionRepo from '../../database/repository/questions/questionRepo.js'
const questionService = {
  /**
   * @param {*} questionsDbName: the name of the database containing the questions_details collection
   * @returns a new questionID based on the number of questions already saved
   */
  generateNewQuestionID: async (questionsDbName) => {
    try {
      return await questionRepo.generateNewQuestionID(questionsDbName);
    } catch (e) {
      console.error('Error generating new question ID:', e);
      return {
        success: false,
        message: 'Error generating new question ID',
      };
    }
  },

  /**
   * @param {*} questionID: the ID of the question
   * @param {*} topic: the topic of the question
   * @param {*} context: the context of the question
   * @param {*} questionsDbName: the name of the database containing the questions_details collection
   * @returns a successful message if the question was saved successfully, or an error message if not
   */
  createNewQuestion: async (questionID, topic, context, questionsDbName) => {
    try {
      const createResult = await questionRepo.createNewQuestion(questionID, topic, context, questionsDbName);
      if (!createResult) {
        return {
          success: false,
          message: 'Error saving a new question',
        };
      }
      return {
        success: true,
        message: 'Question saved successfully',
      };
    } catch (e) {
      console.error('Error saving a new question:', e);
      return {
        success: false,
        message: 'Error saving a new question',
      };
    }
  },

  /**
   * @param {*} questionID: the ID of the question
   * @param {*} time: the amount of time of the ATTEMPT
   * @param {*} correct: whether the ATTEMPT was correct
   * @param {*} questionsDbName: the name of the database containing the questions_details collection
   * @returns a successful message if the question details were updated successfully, or an error message if not
   */
  updateQuestionDetails: async (questionID, time, correct, questionsDbName) => {
    try {
      // generate a new attemptID based on the number of attempts already made for this question
      const newAttemptID = await questionRepo.generateNewAttemptID(questionID, questionsDbName);
      // update the question details with the new attempt
      const updateResults = await questionRepo.updateQuestionDetails(newAttemptID, questionID, time, correct, questionsDbName);
      if (!updateResults.acknowledged) {
        return {
          success: false,
          message: 'Error updating question details',
        };
      }
      return {
        success: true,
        message: 'Question details updated successfully',
      };
    } catch (e) {
      console.error('Error updating question details:', e);
      return {
        success: false,
        message: 'Error updating question details',
      };
    }
  }
}

export default questionService;