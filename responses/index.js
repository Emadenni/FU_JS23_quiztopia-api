function sendResponse(statusCode, success, message) {
  return {
      statusCode: statusCode,
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          success: success,
          message: message,
      }),
  };
}
const sendError = (statusCode, message) => {
  return {
    statusCode,
    body: JSON.stringify({
      error: message,
    }),
  };
};

  module.exports = { sendResponse, sendError };
  