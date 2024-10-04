const { getUser } = require("../../../helpers/getUser");
const { verifyPassword } = require("../../../helpers/verifyPassword");
const { generateToken } = require("../../../helpers/generateToken");
const { sendResponse } = require("../../../responses/index");
const { validateBody } = require("../../../helpers/validateBody");
const { errorHandler } = require("../../../middlewares/errorHandler");
const middy = require('@middy/core'); 

const loginUserHandler = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body);

    const requiredFields = ["username", "password"];
    const bodyValidation = validateBody({ username, password }, requiredFields);

    if (!bodyValidation.valid) {
      return sendError(400, bodyValidation.message);
    }

    const user = await getUser(username);
    if (!user) {
      return sendError(404, "User not found");
    }

    const isPasswordValid = await verifyPassword(password, user.hashedPassword);
    if (!isPasswordValid) {
      return sendError(401, "Invalid password");
    }

    const token = generateToken(user.username, user.userId);
    return sendResponse(200, { success: true, token });

  } catch (error) {
    console.error("Error logging in:", error);
    return sendError(500, "Could not log in: " + error.message);
  }
};

exports.handler = middy(loginUserHandler).use(errorHandler);