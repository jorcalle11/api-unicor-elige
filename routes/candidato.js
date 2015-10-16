var express = require('express');
var controller = require('../controllers/candidato');
var auth	= require('../middlewares/auth');
var router = express.Router();

router.get('/', auth.ensureAuthenticated, controller.allCandidates);
router.get('/profile', auth.ensureAuthenticated, auth.Authorization('candidato'), controller.profile);
router.post('/new', auth.ensureAuthenticated, auth.Authorization('admin'), controller.createCandidate);
router.get('/:candidateId', auth.ensureAuthenticated, controller.getCandidate);
router.put('/:candidateId', auth.ensureAuthenticated, auth.Authorization('candidato'), controller.updateProfile);
router.delete('/:candidateId', auth.ensureAuthenticated, auth.Authorization('admin'), controller.removeCandidate);

router.param('candidateId', controller.candidateByID);

module.exports = router;
