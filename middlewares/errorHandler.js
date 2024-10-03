const { sendError } = require("../responses/index");

const errorHandler = {
    onError: (handler, next) => {
      console.error("Error caught in middleware:", handler.error); 
  
      const message = handler.error.message || "Internal Server Error";
      const statusCode = handler.error.statusCode || 500;
  
      handler.response = sendError(statusCode, message);
  
      
      if (typeof next === 'function') {
        return next();
      }
    },
  };
  

module.exports = { errorHandler };
