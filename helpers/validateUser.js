const validateUser = (username, password) => {
    
    if (username.length < 1 || username.length > 16) {
      return { valid: false, message: 'Username must be between 1 and 16 characters long.' };
    }
    if (password.length < 8 || password.length > 16) {
      return { valid: false, message: 'Password must be between 8 and 16 characters long.' };
    }
  const passwordPattern = /^[a-zA-Z0-9!@#$%^&*]+$/;
    if (!passwordPattern.test(password)) {
      return { valid: false, message: 'Password can only contain letters, numbers, and special characters.' };
    }
  
    
    return { valid: true };
  };
  
  module.exports = { validateUser };
  