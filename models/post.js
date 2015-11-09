var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
	created:{
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required:'Escriba el titulo'
	},
	content:{
		type: String,
		default:'',
		trim: true
	},
	image:{
		url:{
			type: String
			},
		public_id :{
			type: String
		}
	},
	candidate:{
		type: Schema.ObjectId,
		ref: 'Candidato'
	},
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;
