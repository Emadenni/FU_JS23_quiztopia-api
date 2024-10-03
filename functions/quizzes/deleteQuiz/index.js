const { db } = require("../../../services/db");
const { sendResponse, sendError } = require("../../../responses/index");
const middy = require("@middy/core");
const { validateToken } = require("../../../middlewares/auth");
const { errorHandler } = require("../../../middlewares/errorHandler");
const { checkQuizOwnership } = require("../../../middlewares/checkQuizOwnership");

const deleteQuizHandler = async (event) => {
  try {
    const quizId = event.pathParameters.quizId;

    if (!quizId) {
      return sendError(400, "Quiz ID is required");
    }

    const params = {
      TableName: process.env.QUIZZES_TABLE,
      Key: { quizId },
    };

    await db.delete(params);

    return sendResponse(200, { success: true, message: "Quiz deleted successfully." });
  } catch (error) {
    console.error("Error deleting quiz:", JSON.stringify(error));
    return sendError(500, "Could not delete quiz", error);
  }
};

exports.handler = middy(deleteQuizHandler)
  .use(validateToken)
  .use(checkQuizOwnership)
  .use(errorHandler);
