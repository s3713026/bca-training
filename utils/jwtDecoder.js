const JWT = require('jsonwebtoken');

module.exports = (body) => {
  if (!body) {
    return new Error('invalid jwtdata');
  }

  return JWT.verify(body, process.env.JWT, {
    algorithm: 'HS256',
  });
};
