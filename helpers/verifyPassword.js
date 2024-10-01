const bcrypt = require('bcryptjs');

async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  verifyPassword,
};
