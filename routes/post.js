var express = require('express');
var multer = require('multer');
var controller = require('../controllers/post');
var auth = require('../middlewares/auth');
var upload = multer({ dest:'uploads/' });
var nameInputFile = 'image';
var router = express.Router();

router.get('/', auth.ensureAuthenticated, controller.allPosts);
router.get('/me', auth.ensureAuthenticated, auth.Authorization('candidato'), controller.myPosts);
router.post('/new', auth.ensureAuthenticated, auth.Authorization('candidato'), upload.single(nameInputFile), controller.createPost);
router.get('/:postById', auth.ensureAuthenticated, controller.getPost);
router.get('/candidates/:candidateId', auth.ensureAuthenticated, controller.postCandidate);
router.put('/:postById', auth.ensureAuthenticated, auth.Authorization('candidato'), controller.updatePost);
router.put('/newComment/:postById', auth.ensureAuthenticated, controller.addComment);
router.delete('/:postById', auth.ensureAuthenticated, auth.Authorization('candidato'), controller.removePost);

router.param('postById', controller.postByID)
module.exports = router;
