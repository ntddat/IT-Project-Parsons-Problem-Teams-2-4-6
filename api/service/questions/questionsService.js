import questionRepo from '../../database/repository/questions/questionRepo.js'
const questionService = {
  generateNewQuestionID: async (dbName) => {
    try {
      return await questionRepo.generateNewQuestionID(dbName);
    } catch (e) {
      console.error('Error generating new question ID:', e);
      return {
        success: false,
        message: 'Error generating new question ID',
      };
    }
  },

  saveNewQuestion: async (topic, context, dbName) => {
    try {
       await questionRepo.createNewQuestion(topic, context, dbName);
    } catch (e) {
      console.error('Error saving a new question:', e);
      return {
        success: false,
        message: 'Error saving a new question',
      };
    }
  },

  updateQuestionDetails: async (questionID, time, correct, dbName) => {
    try {
      const updateResults = await questionRepo.updateQuestionDetails(questionID, time, correct, dbName);
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