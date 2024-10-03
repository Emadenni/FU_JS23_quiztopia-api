const jwt = require("jsonwebtoken");
require('dotenv').config();

function generateToken(username, userId) {
  const payload = { username, userId };
  const options = { expiresIn: '1h' }; 
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

module.exports = {
  generateToken,
};
