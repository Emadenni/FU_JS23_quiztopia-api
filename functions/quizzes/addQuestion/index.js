const { v4: uuidv4 } = require('uuid');
const { db } = require("../../../services/db");
const { validateAddQuestion } = require('../../../helpers/validateQuestion');
const { sendResponse, sendError } = require("../../../responses/index");
const middy = require('@middy/core');
const { validateToken } = require("../../../middlewares/auth"); 
const { errorHandler } = require("../../../middlewares/errorHandler"); 
const { checkQuizOwnership } = require("../../../middlewares/checkQuizOwnership"); 

const addQuestion = async (event) => {
  const userId = event.userId;
  const quizId = event.pathParameters.quizId;

  console.log(userId);
  

  const body = JSON.parse(event.body);
  const { question, answer, latitude, longitude, points } = body;

  const validationError = await validateAddQuestion(body, userId, quizId);
if (!validationError.isValid) { 
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
    await db.update({
      TableName: process.env.QUIZZES_TABLE, 
      Key: { quizId },
      UpdateExpression: 'SET questions = list_append(if_not_exists(questions, :empty_list), :new_question)',
      ExpressionAttributeValues: {
        ':new_question': [newQuestion],
        ':empty_list': [],
      },
    })

    return sendResponse(200, { message: 'Question added successfully', question: newQuestion });
  } catch (error) {
    console.error("Error adding question:", error);
    return sendError(500, "Could not add question", error);
  }
};

exports.handler = middy(addQuestion) 
    .use(validateToken) 
    .use(checkQuizOwnership)
    .use(errorHandler);
