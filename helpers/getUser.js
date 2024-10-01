const bcrypt = require('bcryptjs');
const { db } = require('../services/db');

async function getUser(username) {
    const { Item } = await db.get({
      TableName: process.env.USERS_TABLE,  
      Key: {
        username: username,
      },
    });
  
    return Item;
  }
  module.exports = { getUser };
