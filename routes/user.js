var express = require('express');
var controller = require('../controllers/user');
var auth = require('../middlewares/auth');
var multer = require('multer');
var upload = multer({ dest:'uploads/' });
var nameInputFile = 'image';
var router = express.Router();

router.get('/', auth.ensureAuthenticated, auth.Authorization('admin'), controller.allUsers);
router.get('/me', auth.ensureAuthenticated, controller.me);
router.post('/new' , auth.ensureAuthenticated, auth.Authorization('admin'), controller.createUser);
router.post('/forgotPassword', controller.forgotPassword);
router.get('/:userId', auth.ensureAuthenticated, controller.getUser);
router.put('/:userID', auth.ensureAuthenticated, upload.single(nameInputFile), controller.updateUser);
router.put('/resetPassword/:userID', controller.resetPassword);
router.put('/changePassword/:userId' , auth.ensureAuthenticated, controller.changePassword);
router.delete('/:userId', auth.ensureAuthenticated, auth.Authorization('admin'), controller.removeUser);

router.param('userId', controller.userByID);

module.exports = router;
