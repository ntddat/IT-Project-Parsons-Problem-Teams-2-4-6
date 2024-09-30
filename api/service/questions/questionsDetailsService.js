import questionDetailsRepo from '../../database/repository/questions/questionDetailsRepo.js'

const questionDetailsService = {
  getTop5RecentQuestionsDetails: async (recentQuestions) => {
    try {
      // put everything into one array, find details for all of them, then sort them again.
      // this way we can avoid making multiple requests to the database
      const allQuestionIDs = recentQuestions.reduce((acc, topic) => acc.concat(topic.top5recent), []); // accumulate all question IDs into this empty array
      const questionDetails = await questionDetailsRepo.getQuestionDetailsFromArray(allQuestionIDs); // fetch everything
      const questionDetailsMap = questionDetails.reduce((acc, question) => {
        acc[question.questionID] = question;
        return acc;
      }, {}); // convert the array into a map for faster lookup
      const result = recentQuestions.map(topic => ({
        topic: topic.topic,
        top5recent: topic.top5recent.map(questionID => questionDetailsMap[questionID]).filter(Boolean) // filter removes any undefined values
      }));
      return result;
    } catch (e) {
      console.error('Error loading question details:', e);
      return {
        success: false,
        message: 'Error loading question details',
      };
    }
  },
}

export default questionDetailsService;