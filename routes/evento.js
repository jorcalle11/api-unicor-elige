var express = require('express');
var controller = require('../controllers/evento');
var auth = require('../middlewares/auth');
var router = express.Router();

router.get('/',  auth.ensureAuthenticated, controller.allEvents);
router.get('/me', auth.ensureAuthenticated, auth.Authorization('candidato'), controller.myEvents);
router.post('/new', auth.ensureAuthenticated, auth.Authorization('candidato'), controller.addEvent);
router.get('/:eventId', auth.ensureAuthenticated, controller.getEvent);
router.get('/candidateEvents/:candidateId', auth.ensureAuthenticated, controller.candidateEvents);
router.put('/:eventId', auth.ensureAuthenticated, auth.Authorization('candidato'), controller.updateEvent);
router.delete('/:eventId', auth.ensureAuthenticated, auth.Authorization('candidato'), controller.removeEvent);

router.param('eventId', controller.eventByID);

module.exports = router;
