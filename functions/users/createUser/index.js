require("dotenv").config();
const { db } = require("../../../services/db");
const bcrypt = require("bcryptjs");
const { sendResponse, sendError } = require("../../../responses/index");
const middy = require("@middy/core");
const { getUser } = require("../../../helpers/getUser");
const { v4: uuidv4 } = require('uuid');

const createUserHandler = async (event) => {
  const { username, password } = JSON.parse(event.body);

  try {
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
      createdAt: new Date().toISOString()
    };

    const result = await db.put({
      TableName: process.env.USERS_TABLE,
      Item: newUser,
    });
    console.log("DB Put Result:", result);

    return sendResponse(201, true, "User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    return sendError(500, "Could not create user: " + error.message);
  }
};

exports.handler = middy(createUserHandler);
