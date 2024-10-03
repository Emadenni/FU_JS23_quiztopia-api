const { db } = require("../services/db");

const checkQuizByTitle = async (title, userId) => {
  const params = {
    TableName: process.env.QUIZZES_TABLE,
    FilterExpression: 'userId = :userId AND title = :title',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':title': title,
    },
  };

  const result = await db.scan(params);
  console.log("Quiz check result:", result);
  return result.Items[0] || null;
};


module.exports = { checkQuizByTitle };
