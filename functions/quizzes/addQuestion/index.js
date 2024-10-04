const { v4: uuidv4 } = require("uuid");
const { db } = require("../../../services/db");
const { validateAddQuestion } = require("../../../helpers/validateQuestion");
const { validateBody } = require("../../../helpers/validateBody");
const { sendResponse, sendError } = require("../../../responses/index");
const middy = require("@middy/core");
const { validateToken } = require("../../../middlewares/auth");
const { errorHandler } = require("../../../middlewares/errorHandler");
const { checkQuizOwnership } = require("../../../middlewares/checkQuizOwnership");

const addQuestion = async (event) => {
  const userId = event.userId;
  const quizId = event.pathParameters.quizId;

  if (!quizId) {
    throw {
      message: "Missing quizId in the path parameters",
      statusCode: 400,
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    console.error("Error parsing body:", e);
    return sendError(400, "Invalid request body");
  }

  const { question, answer, latitude, longitude, points } = body;

  const requiredFields = ["question", "answer", "latitude", "longitude", "points"];
  const bodyValidation = validateBody({ question, answer, latitude, longitude, points }, requiredFields);

  if (!bodyValidation.valid) {
    return sendError(400, bodyValidation.message);
  }

  const validationError = await validateAddQuestion(body, userId, quizId);
  console.log("Validation result:", validationError);
  if (!validationError.isValid) {
    console.log("Validation failed");
    return sendError(400, validationError);
  }

  const newQuestion = {
    questionId: uuidv4(),
    question,
    answer,
    latitude,
    longitude,
    points,
  };

  try {
    console.log("New question object:", newQuestion);

    const quiz = await db.get({
      TableName: process.env.QUIZZES_TABLE,
      Key: { quizId },
    });

    if (!quiz.Item) {
      console.error("Quiz not found for ID:", quizId);
      return sendError(400, "Quiz not found");
    }

  
    await db.update({
      TableName: process.env.QUIZZES_TABLE,
      Key: { quizId },
      UpdateExpression: "SET questions = list_append(if_not_exists(questions, :empty_list), :new_question)",
      ExpressionAttributeValues: {
        ":new_question": [newQuestion],
        ":empty_list": [],
      },
    });

   
    console.log("Question added successfully");

    return sendResponse(200, { message: "Question added successfully", question: newQuestion });
  } catch (error) {
    console.error("Error in addQuestion handler:", error);
    return sendError(500, "Could not add question", error);
  }
};

exports.handler = middy(addQuestion).use(validateToken).use(checkQuizOwnership).use(errorHandler);
