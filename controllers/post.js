var Candidato = require('../models/candidato');
var Post = require('../models/post');
var Comentario = require('../models/comentario');
var errorHandler = require('../middlewares/error');
var _ = require('lodash');
var async = require('async');
var cloudinary =require('cloudinary');

exports.allPosts = function(req,res){
	Post.find().populate('candidate').populate('user').exec(function(err,posts){
		if (err) return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
		res.send(posts);
	})
};

exports.myPosts = function(req,res){
	Post.find({'user':req.user.sub}).exec(function(err,posts){
		if (err) return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
		res.send(posts);
	})
};

exports.postCandidate = function(req,res){
	Post.find({'candidate':req.params.candidateId}).exec(function(err,posts){
		if(err) return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
		res.send(posts);
	})
};

exports.createPost = function(req,res){
	var post = new Post(req.body);
	post.image.url = 'http://res.cloudinary.com/dgmr4poex/image/upload/v1445221842/20150409024722214032_zhcwgm.jpg';

  async.waterfall([
		function searchCandidate(callback){
			Candidato.findOne({'user':req.user.sub}).select('_id').exec(function(err,candidate){
				if(err) callback(errorHandler.getErrorMessage(err));
				callback(null,candidate._id);
			});
		},
    function uploadImage(id, callback){
    	if(req.file){
	      cloudinary.uploader.upload(req.file.path,function(result){
	        callback(null, id, result);
	      });
    	} else {
    		var result = false;
    		callback(null, id, result)
    	}
    },
    function saveUrlImage(id, image, callback){
    	if(image) {
	      post.image.url = image.url;
	      post.image.public_id = image.public_id;
    	}

     	post.candidate = id;
     	post.user = req.user.sub;
      post.save();
      callback(null, post);
    }
  ],function(err,result){
    if (err) return res.status(400).send(err);
    res.status(201).json(result);
  });
};

exports.getPost = function(req,res){
	res.json(req.post);
}

exports.updatePost = function(req,res){
	var editPost = req.post
	updatePost = _.extend(editPost, req.body);

	editPost.save(function(err, postEdited){
		if(err) return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
		res.json(postEdited);
	});
}

exports.removePost = function(req,res){
	var post = req.post;
	if (post.image.public_id) {
		cloudinary.uploader.destroy(post.image.public_id)
	};
	post.remove();
	Comentario.find({'post':post._id},function(err,comments){
		if (comments.length) {
			comments.map(function(comment){
				comment.remove();
			})
		};
	});
	res.json(post);
};

exports.postByID = function(req, res, next, id) {
  Post.findById(id).populate('user').populate('candidate').exec(function(err, postSelected) {
    if (err) return next(err);
    if (!postSelected) return next(new Error('No se encuentra post con el id: ' + id));
    postSelected.user.password = undefined;
    req.post = postSelected;
    next();
  });
};

