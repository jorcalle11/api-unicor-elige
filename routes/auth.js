var express = require('express');
var auth = require('../middlewares/auth');
var ctrlAuthentication = require('../controllers/auth');
var router = express.Router();

router.post('/auth/login', ctrlAuthentication.login);
router.post('/auth/facebook', auth.ensureAuthenticated, ctrlAuthentication.facebook);
router.post('/auth/twitter', auth.ensureAuthenticated, ctrlAuthentication.twitter);
router.post('/auth/instagram', auth.ensureAuthenticated, ctrlAuthentication.instagram);

module.exports = router;
