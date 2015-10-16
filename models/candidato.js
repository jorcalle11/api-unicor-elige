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
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

candidatoSchema.plugin(uniqueValidator,{ message: 'Error, el numero de tarjetón {VALUE}, ya esta en uso.'});
var Candidato = mongoose.model('Candidato',candidatoSchema);

module.exports = Candidato;
