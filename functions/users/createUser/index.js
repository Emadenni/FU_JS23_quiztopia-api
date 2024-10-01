require('dotenv').config();
const { db } = require('../../../services/db');
const bcrypt = require('bcryptjs');
const { sendResponse, sendError } = require('../../../responses/index');
const middy = require('@middy/core');

async function getUser(username) {
  const { Item } = await db.get({
    TableName: process.env.USERS_TABLE,  
    Key: {
      username: username,
    },
  });

  return Item;
}

const createUserHandler = async (event) => {

  const { username, password } = JSON.parse(event.body);

  try {
    console.log("Checking for existing user...");
    const existingUser = await getUser(username);
    console.log("Existing user:", existingUser);
    
    if (existingUser) {
      return sendError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      hashedPassword,
    };

    console.log("Adding new user to DynamoDB:", newUser);
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
