const bcrypt = require('bcryptjs');
const { db } = require('../services/db');
const { sendResponse, sendError } = require('../responses/index');

async function createUser(username, password) {
  try {
    const existingUser = await getUser(username);

    if (existingUser) {
      return sendError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      hashedPassword,
    };

    await db.put({
      TableName: process.env.DYNAMODB_TABLE,
      Item: newUser,
    });

    return sendResponse({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return sendError(500, "Could not create user");
  }
}

async function getUser(username) {
  const { Item } = await db.get({
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      username: username,
    },
  });

  return Item;
}

module.exports = { createUser };
