var User = require('../models/user');
var Candidato = require('../models/candidato');
var Evento = require('../models/evento');
var errorHandler = require('../middlewares/error');

exports.allEvents = function(req,res){
  Evento.find().populate('user').exec(function(err,events){
    if (events.length) {
      events.map(function(element){
        element.user.password = undefined;
      });
    };

    if (err) return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    })
    res.send(events);
  });
};

exports.myEvents = function(req,res){
  Evento.find({'user':req.user.sub}).exec(function(err,events){
    if (err) return res.status(400).send({
      message : errorHandler.getErrorMessage(err)
    });
    res.send(events);
  });
};

exports.candidateEvents = function(req,res){
  Evento.find({'candidate':req.params.candidateId}).exec(function(err,events){
    if (err) return res.status(400).send({
      message:errorHandler.getErrorMessage(err)
    });
    res.json(events);
  });
};

exports.addEvent = function(req,res){
  var newEvent = new Evento(req.body);

  Candidato.findOne({'user':req.user.sub}).select('_id').exec(function(err,candidate){
    if (err) return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });

    newEvent.candidate = candidate._id;
    newEvent.user = req.user.sub;
    newEvent.save(function(err,eventSaved){
      if (err) return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
      res.status(201).json(eventSaved);
    });
  });
};

exports.updateEvent = function(req,res){
  editEvent = req.evento;
  editEvent.title = req.body.title || editEvent.title;
  editEvent.start = req.body.start || editEvent.start;
  editEvent.end = req.body.end || editEvent.end;
  editEvent.place = req.body.place || editEvent.place;
  editEvent.save();
  res.json(editEvent);
};

exports.getEvent = function(req,res){
  res.send(req.evento);
}

exports.removeEvent = function(req,res){
  var evento = req.evento;
  evento.remove();
  res.json(req.evento);
};

exports.eventByID = function(req, res, next, id) {
  Evento.findById(id).populate('candidate').populate('user').exec(function(err, eventSelected) {
    if (err) return next(err);
    if (!eventSelected) return next(new Error('No se encuentra evento con el id: ' + id));
    req.evento = eventSelected;
    next();
  });
};
