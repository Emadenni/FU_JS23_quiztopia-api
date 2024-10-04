require("dotenv").config();
const { db } = require("../../../services/db");
const bcrypt = require("bcryptjs");
const { sendResponse, sendError } = require("../../../responses/index");
const middy = require("@middy/core");
const { getUser } = require("../../../helpers/getUser");
const { v4: uuidv4 } = require("uuid");
const { validateUser } = require("../../../helpers/validateUser");
const { validateBody } = require("../../../helpers/validateBody");
const { errorHandler } = require("../../../middlewares/errorHandler");

const createUserHandler = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body);

    const requiredFields = ["username", "password"];
    const bodyValidation = validateBody({ username, password }, requiredFields);

    if (!bodyValidation.valid) {
      return sendError(400, bodyValidation.message);
    }

    const validation = validateUser(username, password);
    if (!validation.valid) {
      return sendError(400, validation.message);
    }

    const existingUser = await getUser(username);
    if (existingUser) {
      return sendError(400, "User already exists");
    }

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      userId,
      username,
      hashedPassword,
      createdAt: new Date().toISOString(),
    };

    await db.put({
      TableName: process.env.USERS_TABLE,
      Item: newUser,
    });

    return sendResponse(201, true, "User created successfully");

  } catch (error) {
    console.error("Error creating user:", error);
    return sendError(500, "Could not create user: " + error.message);
  }
};

exports.handler = middy(createUserHandler).use(errorHandler);