const { getUser } = require("../../../helpers/getUser");
const { verifyPassword } = require("../../../helpers/verifyPassword");
const { generateToken } = require("../../../helpers/generateToken");
const { sendResponse, sendError } = require("../../../responses/index");
const middy = require('@middy/core'); 

const loginUserHandler = async (event) => {
  console.log("Incoming event:", event);
  const { username, password } = JSON.parse(event.body);

  try {
    const user = await getUser(username);
    if (!user) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, message: "User not found" }),
      };
    }

    const isPasswordValid = await verifyPassword(password, user.hashedPassword);
    if (!isPasswordValid) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, message: "Invalid password" }),
      };
    }

    const token = generateToken(user.username, user.userId);
    return sendResponse(200, { success: true, token });
  } catch (error) {
    console.error("Error logging in:", error);
    return sendError(500, "Could not log in: " + error.message);
  }
};


exports.handler = middy(loginUserHandler);
