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
  function sendError(statusCode, data) {
    return {
      statusCode: statusCode,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    };
  }
  
  module.exports = { sendResponse, sendError };
  