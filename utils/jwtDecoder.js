const JWT = require('jsonwebtoken');

module.exports = (body) => {
  if (!body) {
    return new Error('invalid jwtdata');
  }
  console.log("PRINT HERE", body.toString('uef8'));
  return JWT.verify(body.toString('utf8'), process.env.JWT, {
    algorithm: 'HS256',
  });
};
