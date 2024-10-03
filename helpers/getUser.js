const bcrypt = require('bcryptjs');
const { db } = require('../services/db');

async function getUser(username) {
  try {
    const { Items } = await db.query({
      TableName: process.env.USERS_TABLE,
      IndexName: 'UsernameIndex', 
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': username,
      },
    });

    return Items.length > 0 ? Items[0] : null; 
  } catch (error) {
    console.error("Error retrieving user: ", error);
    throw new Error('Could not retrieve user'); 
  }
}

module.exports = { getUser };
