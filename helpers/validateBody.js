const validateBody = (body, requiredFields) => {
    for (let field of requiredFields) {
      if (!body.hasOwnProperty(field) || body[field] === undefined || body[field] === null || body[field] === "") {
        return { valid: false, message: `The field "${field}" is required.` };
      }
    }
  
    return { valid: true };
  };
  
  module.exports = { validateBody };
  