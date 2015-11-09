var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new	Schema({
  post: {
    type: Schema.ObjectId,
    ref: 'Post'
  },
  created:{
		type: Date,
		default: Date.now
	},
	edited:{
		type: Date
	},
	content:{
		type: String,
		default:'',
		trim: true
	},
	user:{
		type: Schema.ObjectId,
		ref: 'User'
	}
});

var Comentario = mongoose.model('Comentario', commentSchema);

module.exports = Comentario;
