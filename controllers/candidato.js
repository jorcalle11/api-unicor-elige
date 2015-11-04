var User = require('../models/user');
var Candidato = require('../models/candidato');
var Evento = require('../models/evento');
var Post = require('../models/post');
var errorHandler = require('../middlewares/error');
var async = require('async');
var cloudinary = require('cloudinary');

exports.allCandidates = function(req,res){
  Candidato.find().populate('user').exec(function(err,candidates){
    if(err) return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
    candidates.forEach(function(candidate){
      candidate.user.password = undefined;
    });
    res.status(200).json(candidates);
  })
};

exports.createCandidate = function(req,res){
  async.waterfall([
    function searchStudent(callback){
      User.findOne({'identification.number':req.body.number},function(err,user){
        if(err) callback({message: errorHandler.getErrorMessage(err)});
        if(!user) callback({message: 'Error, no existe estudiante con el numero de identificación'});
        callback(null, user)
      });
    },
    function searchCandidate( user, callback){
      Candidato.findOne({'user':user._id},function(err, candidato) {
        if (err) callback({message: errorHandler.getErrorMessage(err)});
        if(candidato) callback({message:'El numero de identificación '+ user.identification.number + ' ya es un candidato'});
        callback(null, false, user);
      });
    },
    function addCandidate(find, user, callback){
      if (!find){
        var candidato = new Candidato();
        candidato.cardNumber = req.body.cardNumber;
        candidato.user = user._id;
        _updateRole(user.identification.number,'candidato');
        candidato.save(function(err,candidate){
          if (err) callback({message: errorHandler.getErrorMessage(err)});
          callback(null, candidate);
        });
      }
    }
  ], function (err, result){
    if(err) return res.status(400).send(err);
    return res.status(200).json(result);
  });
};

exports.getCandidate = function(req,res){
  res.json(req.candidato);
};

exports.removeCandidate = function(req,res){
  var candidate = req.candidato;
  async.waterfall([
    function deleteCandidate(callback){
      candidate.remove(function(err,result){
        if (err) callback({message: errorHandler.getErrorMessage(err)});
        _updateRole(candidate.user.identification.number,'estudiante');
        callback(null,result);
      })
    },
    function deleteEvents(result, callback){
      Evento.remove({'candidate':candidate._id}, function(err, result){
        if (err) callback({message: errorHandler.getErrorMessage(err)});
        callback(null,result);
      });
    },
    function deletePosts(result, callback){
      Post.find({'candidate':candidate._id},function(err,posts){
        if (err) callback({message: errorHandler.getErrorMessage(err)});
        if (posts.length) {
          posts.map(function(post){
            if (post.image.public_id) {
              cloudinary.uploader.destroy(post.image.public_id)
            };
            post.remove();
          })
        };
        callback(null, result)
      })
    }
  ],function (err, result){
    if(err) return res.status(400).send(err);
    return res.status(200).json(candidate);
  });
};

exports.profile = function(req,res){
  Candidato.findOne({'user':req.user.sub}).populate('user').exec(function (err,candidate){
    if(err) return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
    candidate.user.password = undefined;
    res.status(200).json(candidate);
  })
};

exports.updateProfile = function(req,res){
  var putCandidate = req.candidato;
  putCandidate.watchword = req.body.watchword || putCandidate.watchword;
  putCandidate.biography = req.body.biography || putCandidate.watchword;
  if (req.body.provider == 'facebook') {
    putCandidate.facebook.id = undefined;
    putCandidate.facebook.username = undefined;
    putCandidate.facebook.photo = undefined;
  } else if(req.body.provider =='twitter') {
    putCandidate.twitter.id = undefined;
    putCandidate.twitter.username = undefined;
    putCandidate.twitter.photo = undefined;
  } else {
    putCandidate.instagram.id = undefined;
    putCandidate.instagram.username = undefined;
    putCandidate.instagram.photo = undefined;
  }
  putCandidate.save();
  res.json(putCandidate);
};

exports.candidateByID = function(req, res, next, id) {
  Candidato.findById(id).populate('user').populate('proposals').exec(function(err, candidate) {
    if (err) return next(err);
    if (!candidate) return next(new Error('No se encuentra candidato con id: ' + id));
    req.candidato = candidate;
    req.candidato.user.password = undefined;
    next();
  });
};

function _updateRole(number,role){
  User.update({"identification.number" : number},{$set:{roles:[role]}},function (err,data){
    if(err) return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
