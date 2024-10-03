const { db } = require("../services/db");

const checkQuizOwnership = {
  before: async (request) => {
    const userId = request.event.userId;  
    const quizId = request.event.pathParameters.quizId;

    if (!userId) {
      throw new Error("User ID is missing");
    }

    if (!quizId) {
      throw new Error("Quiz ID is missing");
    }

    
    const params = {
      TableName: process.env.QUIZZES_TABLE,
      Key: { quizId },
    };

    const result = await db.get(params)

    if (!result.Item) {
      throw new Error("Quiz not found");
    }

    const quiz = result.Item;

   
    if (quiz.userId !== userId) {
      throw new Error("User is not the owner of this quiz");
    }
  },
};

module.exports = {
  checkQuizOwnership,
};
