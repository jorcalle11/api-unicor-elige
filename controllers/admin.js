var Admin = require('../models/admin');
var errorHandler = require('../middlewares/error');


exports.allAdmins = function(req,res){
  Admin.find(function(err,user){
    if(err)
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    res.status(200).json(user);
  })
};
