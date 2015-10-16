
var mongoose = require('mongoose');
var config = require('../config');
var url;


 if (config.db_username && config.db_password) {
	url = 'mongodb://'+config.db_username+':'+config.db_password+'@ds039674.mongolab.com:39674/'+config.db_name;
 } else{
 	url = 'mongodb://localhost/'+config.db_name;
 };

mongoose.connect(url,function(err){
  if(err) return console.log('Error to connect at dataBase \n',err);
  console.log('connected to dataBase');
});

module.exports = mongoose;
