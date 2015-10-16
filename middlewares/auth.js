var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../config');
//token
exports.ensureAuthenticated = function(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(403).send({
      message: "Tu petición no tiene cabecera de autorización"
    });
  }

  var token = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(token, config.TOKEN_SECRET);

  if(payload.exp <= moment().unix()) {
     return res.status(401).send({
      message: "El token ha expirado"
    });
  }
  req.user = payload;
  next();
}

exports.Authorization = function(roleRequired) {
  if (!roleRequired) {
   console.log('Required role needs to be set');
  };
  return function(req,res,next){
    if(req.headers.authorization) {
      if (req.user.role == roleRequired) {
        return next();
      } else {
        return res.status(401).send({
          message: 'Usuario no authorizado'
        });
      }
    } else{
      return res.status(403).send({
        message: 'Necesitas estar logueado!'
      });
    }
  }
};

