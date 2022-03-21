const JWT = require('jsonwebtoken');

module.exports = (body) => {
  if (!body) {
    console.log("IN HỂ")
    return new Error('invalid jwtdata');
  }
  if(body == null){
    console.log("have body")
  } else{
    console.log("can't find body")
  }
  console.log("PRINT HERE", JSON.stringify(body));
  return JWT.verify(body.toString('utf8'), process.env.JWT, {
    algorithm: 'HS256',
  });
};
