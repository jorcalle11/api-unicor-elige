var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventoSchema = new Schema({
  title: {
    type: String,
    required: 'Escriba el titulo del evento',
    default: ''
  },
  start: {
    type : Date,
    required: 'Escriba la fecha del evento'
  },
  end: {
    type: Date
  },
  place: {
    type: String,
    default:''
  },
  candidate: {
    type: Schema.ObjectId,
    ref: 'Candidato'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});


var Evento = mongoose.model('Evento',eventoSchema);

module.exports =  Evento;

