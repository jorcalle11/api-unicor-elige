var User = require('../models/user');
var Candidato = require('../models/candidato');
var errorHandler = require('../middlewares/error');
var cloudinary = require('../config/cloudinary');
var nodemailer = require('../config/nodemailer');
var password = require('../middlewares/password');
var public_id = 'user_dez4rt';

exports.allUsers = function(req,res){
  User.find({},function(err, users){
    if(err) return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
    });
    res.status(200).json(users);
  });
};

exports.createUser = function(req,res){
  var user = new User(req.body);
  user.displayName = user.firstName +' '+ user.lastName;
  //user.password = password.generatePassword();
  user.password = 'jomaca11';
  var passwordTemp = user.password;
  user.image.url = 'http://res.cloudinary.com/dgmr4poex/image/upload/v1443021374/user_dez4rt.png';
  user.image.public_id = 'user_dez4rt';

  user.save(function(err){
    if (err) return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
    //nodemailer.registerMail({name: user.displayName, email: user.email, password: passwordTemp});
    res.status(201).json(user);
  });
};

exports.getUser = function(req,res){
  return res.status(200).json(req.userTemp);
};

exports.updateUser = function(req,res){
  User.findById(req.params.userID).select('displayName image votation').exec(function(err,user){
    if (err) return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
    if (!user) return res.send({message:'Usuario no encontrado!'});

    user.displayName = req.body.displayName || user.displayName;

    if (req.body.votation) {
      user.votation = req.body.votation;
      Candidato.update({'_id':req.body.candidate},{'$inc':{'popularity':1}});
    };

    if (req.file){
      if (user.image.public_id != public_id) {
        cloudinary.uploader.destroy(user.image.public_id);
      };
      cloudinary.uploader.upload(req.file.path,function(result){
        user.image.url = result.url;
        user.image.public_id = result.public_id;
        user.save()
        res.send(user);
      },{
        width: 400,
        height: 400,
        crop: 'fill'
      });
    } else{
      user.save();
      res.send(user);
    }
  });
};

exports.removeUser = function(req,res){
  var userTemp = req.userTemp;
  userTemp.remove();

  if (req.userTemp.image.public_id != public_id)
    cloudinary.uploader.destroy(req.userTemp.image.public_id)

  Candidato.findOne({'user':userTemp._id}).exec(function(err,candidate){
    if(candidate) candidate.remove();
  });
  res.json(userTemp);
};

exports.me = function(req,res){
  User.findById(req.user.sub).exec(function(err,user){
    if (err) return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
      user.password = undefined;
      user.roles = [];
    res.json(user);
  })
};

exports.forgotPassword = function(req,res){
  User.findOne({'email':req.body.email.toLowerCase()}).select('_id email displayName').exec(function(err,user){
    if (err) return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
    if (!user) return res.status(404).send({
      message: 'Usuario no encontrado!'
    });
    nodemailer.resetPasswordEmail(user);
    res.send({message: 'Revisa tu Correo y sigue las instrucciones.'});
  });
}

exports.resetPassword = function(req,res){
  var userID = req.params.userID;
  User.findById(userID).select('password email displayName').exec(function(err,user){
    if (err) return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
    if (!user) return res.status(404).send({
      message: 'Usuario no encontrado!'
    });
    user.password = req.body.password;
    user.save(function(err, saved){
      if (err) return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
      nodemailer.confirmPassword(user);
      res.send({message:'Contraseña actualizada'});
    });
  });
}

exports.changePassword = function(req,res){
  var user = req.userTemp;
  if(user.validPassword(req.body.current, req.userTemp.password)){
    user.password = req.body.new;
    user.save(function(err,saved){
      if (err) return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
      res.send({message:'Contraseña actualizada'});
    })
  } else{
    res.status(400).send({
      message: 'Contraseña incorrecta'
    });
  };
};

exports.userByID = function(req, res, next, id) {
  User.findById(id).exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('No se encuentra usuario con el id: ' + id));
    req.userTemp = user;
    next();
  });
};


