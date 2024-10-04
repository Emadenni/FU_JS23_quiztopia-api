const { db } = require("../../../services/db");
const { sendResponse, sendError } = require("../../../responses/index");
const { validateToken } = require("../../../middlewares/auth");
const { errorHandler } = require("../../../middlewares/errorHandler");
const middy = require("@middy/core");
require("dotenv").config();

const getTopScoresByQuiz = async (event) => {
  try {
    const params = {
      TableName: process.env.SCORES_TABLE,
    };

    const scores = await db.scan(params);
    const topScores = {};

    scores.Items.forEach((score) => {
      const quizId = score.quizId;

      if (!topScores[quizId]) {
        topScores[quizId] = {
          quizId,
          topScores: [{ playerId: score.userId, totalScore: score.totalScore }],
        };
      } else {
        const existingTopScore = topScores[quizId].topScores.find((item) => item.playerId === score.userId);

        if (existingTopScore) {
       
          if (score.totalScore > existingTopScore.totalScore) {
            existingTopScore.totalScore = score.totalScore;
          }
        } else {
         
          topScores[quizId].topScores.push({ playerId: score.userId, totalScore: score.totalScore });
        }
      }
    });

    
    Object.keys(topScores).forEach((quizId) => {
      topScores[quizId].topScores.sort((a, b) => b.totalScore - a.totalScore);
      topScores[quizId].topScores = topScores[quizId].topScores.slice(0, 3); 
    });

    return sendResponse(200, Object.values(topScores));
  } catch (error) {
    console.error("Error retrieving top scores:", error);
    return sendError(500, "Could not retrieve top scores", error);
  }
};

exports.handler = middy(getTopScoresByQuiz).use(validateToken).use(errorHandler);
