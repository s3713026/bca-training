const JWT = require('jsonwebtoken');

module.exports = (body) => {
  if (!body) {
    console.log("IN HỂ")
    return new Error('invalid jwtdata');
  }
  
  console.log("PRINT HERE", JSON.stringify(body));
  return JWT.verify(body.toString('utf8'), process.env.JWT, {
    algorithm: 'HS256',
  });
};
