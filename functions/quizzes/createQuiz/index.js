require("dotenv").config();
const { db } = require("../../../services/db");
const { sendResponse, sendError } = require("../../../responses/index");
const middy = require("@middy/core");
const { checkQuizByTitle } = require("../../../helpers/checkQuizName");
const { validateToken } = require("../../../middlewares/auth"); 
const { errorHandler } = require("../../../middlewares/errorHandler"); 
const { v4: uuidv4 } = require("uuid");

const createQuizHandler = async (event) => {
  try {
    const { title } = JSON.parse(event.body);
    const extractedUserId = event.userId;

    if (!extractedUserId) {
      console.error("User ID is missing or invalid");
      return sendError(401, "User ID is missing or invalid");
    }

    if (!title) {
      console.error("Quiz title is required");
      return sendError(400, "Quiz title is required");
    }

    const userExists = await checkUserExists(extractedUserId);

    if (!userExists) {
      console.error("User not found");
      return sendError(404, "User not found");
    }

    const existingQuiz = await checkQuizByTitle(title, extractedUserId);

    if (existingQuiz) {
      console.error("Quiz with this title already exists");
      return sendError(400, "Quiz with this title already exists");
    }

    const newQuiz = {
      quizId: uuidv4(),
      title,
      userId: extractedUserId,
      createdAt: new Date().toISOString(),
    };

    const params = {
      TableName: process.env.QUIZZES_TABLE,
      Item: newQuiz,
    };

    await db.put(params);

    return sendResponse(201, { success: true, message: "Quiz created successfully" });
  } catch (error) {
    console.error("Error creating quiz:", JSON.stringify(error, null, 2));
    return sendError(500, "Could not create quiz", error.message || "Unknown error");
  }
};

const checkUserExists = async (userId) => {
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: { userId },
  };

  const result = await db.get(params);
  console.log("User check result:", result);
  return result.Item ? true : false;
};


exports.handler = middy(createQuizHandler)
  .use(validateToken)
  .use(errorHandler);
