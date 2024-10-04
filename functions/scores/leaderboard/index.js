const db = require("../../../services/db");
const { sendResponse, sendError } = require("../../../responses/index");

const getTopScoresByQuiz = async (event) => {
  try {
    const params = {
      TableName: process.env.SCORES_TABLE,
    };

    const scores = await db.scan(params);
    const topScores = {};

    
    scores.Items.forEach(score => {
      const quizId = score.quizId;

      if (!topScores[quizId]) {
        topScores[quizId] = {
          quizId,
          topScore: score.totalScore,
          playerId: score.userId,
        };
      } else if (score.totalScore > topScores[quizId].topScore) {
        topScores[quizId].topScore = score.totalScore;
        topScores[quizId].playerId = score.userId;
      }
    });

    return sendResponse(200, Object.values(topScores));
  } catch (error) {
    console.error("Error retrieving top scores:", error);
    return sendError(500, "Could not retrieve top scores", error);
  }
};

exports.handler = getTopScoresByQuiz;
