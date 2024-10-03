const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateToken = {
  before: async (request) => {
    try {
      const authHeader = request.event.headers.authorization;

      if (!authHeader) {
        throw new Error("Authorization header is missing");
      }

      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        throw new Error("Token is missing");
      }

      const data = jwt.verify(token, process.env.JWT_SECRET);

      if (!data.username || !data.userId) {
        throw new Error("Token does not contain required fields");
      }

      request.event.username = data.username;
      request.event.userId = data.userId;

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error("Token has expired, please log in again.");
      }
      throw new Error(`Invalid token: ${error.message}`);
    }
  },
};

module.exports = { validateToken };
