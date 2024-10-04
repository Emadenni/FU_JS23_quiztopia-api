const db = require("../services/db");
require('dotenv').config();

const validateQuestionInQuiz = async (quizId, questionId) => {
    try {
        const quiz = await db.get({
            TableName: process.env.QUIZZES_TABLE,
            Key: { quizId }
        });

        if (!quiz.Item) {
            throw new Error('Quiz not found');
        }

        const questionExists = quiz.Item.questions.some(q => q.questionId === questionId);
        if (!questionExists) {
            throw new Error('Question does not belong to this quiz');
        }

        return true;
    } catch (error) {
        console.error("Error validating question:", error);
        throw error;  
    }
};

module.exports = {
    validateQuestionInQuiz
};