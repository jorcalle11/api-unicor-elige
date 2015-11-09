var express = require('express');
var controller = require('../controllers/comentario');
var auth = require('../middlewares/auth');
var router = express.Router();

router.get('/', controller.allComments);
router.get('/me', auth.ensureAuthenticated, controller.myComments);
router.post('/new', auth.ensureAuthenticated, controller.createComment);
router.get('/post/:postId',auth.ensureAuthenticated, controller.commentsByPost);
router.get('/:commentById', auth.ensureAuthenticated, controller.getComment);
router.put('/:commentById', auth.ensureAuthenticated, controller.editComment);
router.delete('/:commentById', auth.ensureAuthenticated, controller.removeComment);

router.param('commentById', controller.commentById)
module.exports = router;
