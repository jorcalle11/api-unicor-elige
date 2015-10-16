var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new	Schema({
  post: {
    type: Schema.ObjectId,
    ref: 'Post'
  },
  postCandidate: {
    type: Schema.ObjectId,
    ref: 'Candidato'
  },
  postCandidateUser:{
    type: Schema.ObjectId,
    ref: 'User'
  },
  comment:[{
    created:{
  		type: Date,
  		default: Date.now
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
  }]
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;
