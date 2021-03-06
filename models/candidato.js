var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var candidatoSchema = new Schema({
  biography : {
    type: String,
    trim : true,
    default: ''
  },
  cardNumber :{
    type : String,
    trim : true,
    unique: true,
    required : 'Numero de tarjetón, es obligatorio!'
  },
  // lema o frase representativa :P
  watchword : {
    type: String,
    trim : true,
    default: ''
  },
  proposals: [{
    content: {
      type: String,
      default: ''
    },
    creation: {
      type: Date,
      default: Date.now
    },
    lastModified : {
      type: Date,
      default: Date.now
    }
  }],
  facebook:{
    id:{
      type: String
    },
    username: {
      type: String
    },
    photo: {
      type: String
    }
  },
  twitter:{
    id:{
      type: String
    },
    username: {
      type: String
    },
    photo: {
      type: String
    }
  },
  instagram:{
    id:{
      type: String
    },
    username: {
      type: String
    },
    photo: {
      type: String
    }
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  popularity:{
    type: Number,
    default: 0
  }
});

candidatoSchema.plugin(uniqueValidator,{ message: 'Error, el numero de tarjetón {VALUE}, ya esta en uso.'});
var Candidato = mongoose.model('Candidato',candidatoSchema);

module.exports = Candidato;
