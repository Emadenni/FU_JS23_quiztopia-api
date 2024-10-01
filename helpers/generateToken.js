const jwt = require("jsonwebtoken");
require('dotenv').config();


function generateToken(username) {
  const payload = { username };
  const options = { expiresIn: '1h' }; 
  return jwt.sign(payload, process.env.SECRET, options);
}

module.exports = {
generateToken,
};
