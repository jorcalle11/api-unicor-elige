var Post = require('../models/post');
var Comentario = require('../models/comentario');
var errorHandler = require('../middlewares/error');

exports.allComments = function(req,res){
	Comentario.find().exec(function(err,comments){
		if (err) return res.status(400).send(err);
		res.send(comments);
	})
}

exports.createComment = function(req,res){
	Post.findOne({'_id':req.body.post}, function(err,post){
		if (err) return res.status(400).send(err);
		if (!post) return res.status(404).send({
			message: 'No existe post con id ' +req.body.post
		});

		var comment = new Comentario({
			post: req.body.post,
			created: req.body.created || Date.now(),
			content: req.body.content,
			user: req.user.sub
		});

		comment.save(function(err,commentSaved){
			if (err) return res.status(400).send(err);
			res.json(commentSaved.populate('user','displayName image'));
		});
	})
};

exports.commentsByPost = function(req,res){
	Comentario.find({'post':req.params.postId}).sort({'created':1}).populate('user','displayName image').exec(function(err,comments){
		if (err) return res.status(400).send(err);
		res.send(comments);
	});
};

exports.myComments = function(req,res){
	Comentario.find({'user':req.user.sub},function(err,comments){
		if (err) return res.status(400).send(err);
		res.send(comments);
	})
};

exports.getComment = function(req,res){
	res.json(req.comment);
}

exports.editComment = function(req,res){
	var putComment = req.comment;
	putComment.content = req.body.content || req.comment.content;
	putComment.edited = req.body.edited || req.comment.edited;
	putComment.save();
	res.json(putComment);
};

exports.removeComment = function(req,res){
	var comment = req.comment;
	Comentario.remove(req.comment,function(err, commentRemoved){
		if (err) return res.status(400).send(err);
		res.json(comment);
	});
}

exports.commentById = function(req,res,next, id){
	Comentario.findById(id).populate('user','displayName image').exec(function(err,commentSelected){
		if (err) return next(err);
		if (!commentSelected) return next(new Error('No se encuentra comentario con id '+ id))
		req.comment = commentSelected;
		next();
	});
}
