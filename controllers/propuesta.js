var Candidato = require('../models/candidato');
var mongoose = require('mongoose');
var errorHandler = require('../middlewares/error');

exports.addProposal = function(req,res){
  var proposal = {};
  proposal._id = mongoose.Types.ObjectId();
  proposal.content = req.body.content;
  proposal.creation = Date.now();
  proposal.lastModified = Date.now();
  Candidato.update({'user':req.user.sub},{ '$push': {'proposals': proposal}}, function(err, ok){
    res.json(proposal);
  });
};

exports.getProposal = function(req,res){
	var proposalId = req.params.proposalId;
	var find;
	Candidato.findOne({'user':req.user.sub},function (err, candidate){
		if (candidate) {
			candidate.proposals.map(function(proposal){
				if (proposal._id == proposalId) {
					find = proposal;
				};
			});

			if (find) {
				res.status(200).json(find);
			} else {
				res.status(404).send({
					message: 'No se encuentra propuesta con id '+proposalId
				});
			}
		};
	})
};

exports.updateProposal = function(req,res){
	var proposalId = req.params.proposalId;
	var position;
	var find;
	Candidato.findOne({'user':req.user.sub} ,function (err, candidate){
		if (candidate) {
			candidate.proposals.map(function(proposal, index){
				if (proposal._id == proposalId) {
					find = proposal;
					position = index;
					proposal.content = req.body.content || proposal.content;
					proposal.lastModified = Date.now();
				};
			});
			if (find) {
				candidate.save();
				res.json(candidate.proposals[position]);
			} else {
				res.status(404).send({
					message: 'No se encuentra propuesta con id '+proposalId
				});
			}
		}
	});
};

exports.removeProposal = function(req,res){
	var proposalId = req.params.proposalId;
	var find;
	Candidato.findOne({'user':req.user.sub} ,function (err, candidate){
		if (candidate) {
			candidate.proposals.map(function(proposal, index){
				if (proposal._id == proposalId) {
					find = proposal;
					candidate.proposals.splice(index, 1);
				};
			});
			if (find) {
				candidate.save();
				res.json(find);
			} else {
				res.status(404).send({
					message: 'No se encuentra propuesta con id '+proposalId
				});
			}
		}
	});
};
