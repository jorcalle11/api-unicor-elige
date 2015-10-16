var express = require('express');
var admin = require('../controllers/admin');
var auth = require('../middlewares/auth');
var router = express.Router();


router.get('/', auth.ensureAuthenticated, auth.Authorization('admin'), admin.allAdmins);

module.exports = router;
