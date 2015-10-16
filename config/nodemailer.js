var config = require('./index');
var nodemailer = require('nodemailer');
var hogan = require('hjs');
var fs = require('fs');


var transporter = nodemailer.createTransport({
	service: config.nodemailer.service,
	auth: {
		user: config.nodemailer.auth.user,
		pass: config.nodemailer.auth.pass
	}
});

exports.registerMail = function (user){
	var template = fs.readFileSync('./views/emails/register.hjs','utf-8');
	var templateCompiled = hogan.compile(template);
	var mailOptions = {
		from: 'App UnicorElige ✔ <unicorelige@gmail.com>',
		to : user.email,
		subject: 'Bienvenido a UnicorElige!',
		html	: templateCompiled.render({
			name: user.name,
			email: user.email,
			password: user.password
		})
	};
	transporter.sendMail(mailOptions, function(err, info){
	    if (err) console.log(err);
	});
};

exports.resetPasswordEmail = function(user){
	var template = fs.readFileSync('./views/emails/resetPassword.hjs','utf-8');
	var templateCompiled = hogan.compile(template);
	var mailOptions = {
		from: 'App UnicorElige ✔ <unicorelige@gmail.com>',
		to : user.email,
		subject: 'Resetear Contraseña en UnicorElige',
		html	: templateCompiled.render({
			name: user.displayName,
			id: user._id
		})
	};
	transporter.sendMail(mailOptions, function(err, info){
	    if (err) console.log(err);
	});
}
exports.confirmPassword = function(user){
	var template = fs.readFileSync('./views/emails/confirmPassword.hjs','utf-8');
	var templateCompiled = hogan.compile(template);
	var mailOptions = {
		from: 'App UnicorElige ✔ <unicorelige@gmail.com>',
		to : user.email,
		subject: 'Tu Contraseña ha sido cambiada',
		html	: templateCompiled.render({
			name: user.displayName,
			email: user.email
		})
	};
	transporter.sendMail(mailOptions, function(err, info){
	    if (err) console.log(err);
	});
}
