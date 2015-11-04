var User = require('../models/user');
var Admin = require('../models/admin');
var Candidato = require('../models/candidato');
var service = require('../middlewares/token');
var config = require('../config');
var qs = require('querystring');
var request = require('request');

exports.login = function(req,res){
  if(!req.body.email) return res.status(400).send({
    message : 'Error al iniciar Sesión, intentalo nuevamente'
  });
  User.findOne({'email':req.body.email.toLowerCase()},function(err,user){
    if(user)
      if(user.validPassword(req.body.password))
        res.status(200).json({'token':service.createToken(user)});
        else
        res.status(400).send({message:'Contraseña Incorrecta'});
    else
      _searchAdmin(req,res);
  });
};

exports.facebook = function(req,res){
  var accessTokenUrl = 'https://graph.facebook.com/v2.3/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.3/me';
  var params = {
    code : req.body.code,
    client_id: req.body.clientId,
    client_secret: config.facebook_secret,
    redirect_uri: req.body.redirectUri
  };

  request.get({url: accessTokenUrl, qs: params, json: true}, function (err, response, accessToken){
    if (response.statusCode !==200){
      return res.status(500).send({
        message: accessToken.error.message
      });
    }
    request.get({url: graphApiUrl, qs: accessToken, json: true}, function (err, response, profile){
      if (response.statusCode !==200) {
        return res.status(500).send({
          message: profile.error.message
        });
      };
      if (req.headers.authorization) {
        Candidato.findOne({'facebook.id':profile.id},function (err, user){
          if (user) {
            return res.status(409).send({
              message: 'La cuenta de facebook ya ha sido vinculada'
            })
          };
          Candidato.findOne({'user':req.user.sub},function (err,candidate){
            candidate.facebook.id = profile.id;
            candidate.facebook.username = profile.name;
            candidate.facebook.photo = 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            candidate.save(function(){
              User.findById(candidate.user, function (err,user){
              	if (user) {
            			res.json({token: service.createToken(user)});
              	};
              })
            })
          })
        })
      };
    })
  })
};

exports.twitter = function(req,res){
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  var profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

  if (!req.body.oauth_token || !req.body.oauth_verifier) {
    var requestTokenOauth = {
      consumer_key: config.twitter_key,
      consumer_secret: config.twitter_secret,
      callback: req.body.redirectUri
    };

    request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
      var oauthToken = qs.parse(body);

      res.send(oauthToken);
    });
  } else {

    var accessTokenOauth = {
      consumer_key: config.twitter_key,
      consumer_secret: config.twitter_secret,
      token: req.body.oauth_token,
      verifier: req.body.oauth_verifier
    };

    request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, accessToken) {

      accessToken = qs.parse(accessToken);

      var profileOauth = {
        consumer_key: config.twitter_key,
        consumer_secret: config.twitter_secret,
        oauth_token: accessToken.oauth_token
      };

      request.get({
        url: profileUrl + accessToken.screen_name,
        oauth: profileOauth,
        json: true
      }, function(err, response, profile) {

  			if (req.headers.authorization) {
  				Candidato.findOne({ 'twitter.id': profile.id }, function (err, user){
  					if (user) {
  						return res.status(409).send({
  							message:'La cuenta de twitter ya ha sido vinculada'
  						})
  					};
  					Candidato.findOne({ 'user':req.user.sub }, function (err, candidate){
  						candidate.twitter.id = profile.id;
  						candidate.twitter.username = profile.screen_name;
  						candidate.twitter.photo = profile.profile_image_url.replace('_normal', '');
  						//candidate.twitter.followers = profile.followers_count;
  						//candidate.twitter.friends = profile.friends_count;
  						candidate.save(function(){
	              User.findById(candidate.user, function (err,user){
	              	if (user) {
	            			res.json({token: service.createToken(user)});
	              	};
	              })
  						});
  					});
  				});
  			}
  		});
  	});
  }
};

exports.instagram = function(req,res){
  var accessTokenUrl = 'https://api.instagram.com/oauth/access_token';

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    client_secret: config.instagram_secret,
    code: req.body.code,
    grant_type: 'authorization_code'
  };

  request.post({ url: accessTokenUrl, form: params, json: true }, function(error, response, body) {

    if (req.headers.authorization) {
      Candidato.findOne({ 'instagram.id': body.user.id }, function(err, existingUser) {
        if (existingUser) {
          return res.status(409).send({
          	message: 'La cuenta de instagram ya ha sido vinculada'
          });
        }
        Candidato.findOne({'user':req.user.sub}, function(err, candidate) {
          candidate.instagram.id = body.user.id;
          candidate.instagram.photo = body.user.profile_picture;
          candidate.instagram.username = body.user.username;
          candidate.save(function() {
          	User.findById(candidate.user, function(err,user){
            	res.send({ token: service.createToken(user) });
          	});
          });
        });
      });
    }
  });
};

function _searchAdmin(req, res){
  Admin.findOne({'email':req.body.email.toLowerCase()},function(err,admin){
    if(admin)
      if(admin.validPassword(req.body.password))
        res.status(200).json({'token':service.createToken(admin)});
        else
        res.status(400).send({message:'Contraseña Incorrecta'});
    else
      res.status(400).send({message: 'Error, usuario no encontrado!'});
  });
}
