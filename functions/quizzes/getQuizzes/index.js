const { db } = require("../../../services/db");
const { sendResponse, sendError } = require("../../../responses/index");
const middy = require("@middy/core");
const { validateToken } = require("../../../middlewares/auth");
const { errorHandler } = require("../../../middlewares/errorHandler");

const getQuizzes = async (event) => {
  const userId = event.userId; 

try {
    const params = {
      TableName: process.env.QUIZZES_TABLE,
     
    };

    const result = await db.scan(params); 
    return sendResponse(200, {
      quizzes: result.Items, 
    });
  } catch (error) {
    console.error("Error retrieving quizzes:", error);
    return sendError(500, "Could not retrieve quizzes", error);
  }
};

exports.handler = middy(getQuizzes)
  .use(validateToken) 
  .use(errorHandler);
