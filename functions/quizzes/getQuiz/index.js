require("dotenv").config();
const { db } = require("../../../services/db");
const { sendResponse, sendError } = require("../../../responses/index");
const middy = require("@middy/core");
const { validateToken } = require("../../../middlewares/auth");
const { errorHandler } = require("../../../middlewares/errorHandler");

const getQuizHandler = async (event) => {
  try {
    const quizId = event.pathParameters.quizId; 

    if (!quizId) {
      return sendError(400, "Quiz ID is required");
    }

    const params = {
      TableName: process.env.QUIZZES_TABLE,
      Key: { quizId },
    };

    const result = await db.get(params);

    if (!result.Item) {
      return sendError(404, "Quiz not found or missing parameters");
    }

    return sendResponse(200, { success: true, quiz: result.Item });
  } catch (error) {
    console.error("Error retrieving quiz:", JSON.stringify(error));
    return sendError(500, "Could not retrieve quiz", error);
  }
};

exports.handler = middy(getQuizHandler)
  .use(validateToken)
  .use(errorHandler);
