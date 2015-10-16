var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userEventsSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  myEvents: [{
    type: Schema.ObjectId,
    ref: 'Evento'
  }],
  eventCandidate: {
    type: Schema.ObjectId,
    ref: 'Candidato'
  },
  eventCandidateUser:{
    type: Schema.ObjectId,
    ref: 'User'
  }
});

var UserEvents = mongoose.model('EventosUsario', userEventsSchema);

module.exports = UserEvents;
