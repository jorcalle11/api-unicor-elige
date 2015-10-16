var express = require('express');
var controller = require('../controllers/propuesta');
var auth = require('../middlewares/auth');
var router = express.Router();

router.post('/new', auth.ensureAuthenticated, auth.Authorization('candidato'), controller.addProposal);
router.get('/:proposalId', auth.ensureAuthenticated, controller.getProposal);
router.put('/:proposalId', auth.ensureAuthenticated, auth.Authorization('candidato'), controller.updateProposal);
router.delete('/:proposalId', auth.ensureAuthenticated, auth.Authorization('candidato'), controller.removeProposal);

module.exports = router;
