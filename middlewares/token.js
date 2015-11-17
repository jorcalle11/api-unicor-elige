var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../config');

module.exports.createToken = function(user){
  var payload = {
    sub: user._id,
    email: user.email,
    image: user.image,
    votation: user.votation,
    iat: moment().unix(),
    exp: moment().add(2, "days").unix()
  };
  if (user.roles) {
    payload.role = user.roles[0];
    payload.displayName = user.displayName;
  } else{
    payload.displayName = user.name,
    payload.role = 'admin';
  };
  return jwt.encode(payload,config.TOKEN_SECRET);
};
