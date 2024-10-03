const jwt = require("jsonwebtoken");

const validateToken = {
  before: async (request) => {
    try {
      console.log("Middleware execution started");

      const authHeader = request.event.headers.authorization;
      console.log("Authorization header:", authHeader);

      if (!authHeader) throw new Error("Authorization header is missing");

      const token = authHeader.replace("Bearer ", "");
      if (!token) throw new Error("Token is missing");

      const data = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token data:", data);

      if (!data.username || !data.userId) {
        throw new Error("Token does not contain required fields");
      }

      request.event.username = data.username;
      request.event.userId = data.userId;

      console.log("User ID extracted:", request.event.userId);
      console.log("Username extracted:", request.event.username);

      return; 
    } catch (error) {
      console.error("Token validation error:", error.message);
      
      throw new Error(`Invalid token: ${error.message}`);
    }
  },
};


module.exports = { validateToken };
