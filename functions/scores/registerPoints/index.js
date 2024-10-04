const { v4: uuidv4 } = require("uuid");
const { db } = require("../../../services/db");
const { validateToken } = require("../../../middlewares/auth");
const { errorHandler } = require("../../../middlewares/errorHandler");
const { sendResponse, sendError } = require("../../../responses/index");
const middy = require("@middy/core");
require("dotenv").config();

const registerPoints = async (event) => {
  const quizId = event.pathParameters.quizId;
  const questionId = event.pathParameters.questionId;
  const userId = event.userId;

  if (!quizId || !questionId) {
    throw {
        message: "Missing quizId or questionId in the path parameters",
        statusCode: 400
    };
}


  try {
    const params = {
      TableName: process.env.QUIZZES_TABLE,
      Key: { quizId },
    };

    const quiz = await db.get(params);

    if (!quiz.Item) {
      return sendError(400, "Quiz not found");
    }

    const questionExists = quiz.Item.questions.some((q) => q.questionId === questionId);
    if (!questionExists) {
      return sendError(400, "Question does not belong to this quiz");
    }

    const question = quiz.Item.questions.find((q) => q.questionId === questionId);
    const points = question.points;

    const score = await db.get({
      TableName: process.env.SCORES_TABLE,
      Key: { quizId, userId },
    });

    if (score.Item) {
  
      const alreadyAnswered = score.Item.answers.some((answer) => answer.questionId === questionId);
      if (alreadyAnswered) {
        return sendError(400, "Question has already been answered");
      }
    }

    let newTotalScore;
    let updatedAnswers;

    if (score.Item) {
      newTotalScore = score.Item.totalScore + points;
      updatedAnswers = score.Item.answers ? [...score.Item.answers, { questionId, points }] : [{ questionId, points }];
      await db.update({
        TableName: process.env.SCORES_TABLE,
        Key: { quizId, userId },
        UpdateExpression:
          "SET totalScore = :newScore, answers = list_append(if_not_exists(answers, :empty_list), :newAnswer)",
        ExpressionAttributeValues: {
          ":newScore": newTotalScore,
          ":newAnswer": [{ questionId, points }],
          ":empty_list": [],
        },
      });
    } else {
      newTotalScore = points;
      updatedAnswers = [{ questionId, points }];
      const newScoreId = uuidv4();
      await db.put({
        TableName: process.env.SCORES_TABLE,
        Item: {
          scoreId: newScoreId,
          quizId,
          userId,
          totalScore: points,
          answers: updatedAnswers,
        },
      });
    }

    return sendResponse(200, {
      message: "Points registered successfully",
      totalScore: newTotalScore,
      playerId: userId,
      answers: updatedAnswers, // Restituisco anche le risposte con i punti per ogni domanda
    });
  } catch (error) {
    console.error("Error registering points:", error);
    return sendError(500, "Could not register points", error);
  }
};

exports.handler = middy(registerPoints).use(validateToken).use(errorHandler);
