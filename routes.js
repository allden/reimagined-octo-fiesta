const express = require('express');
const router = express.Router();
const UserController = require('./controllers/UserController');
const PostController = require('./controllers/PostController');
const CommentController = require('./controllers/CommentController');
// passport
const passport = require('passport');

// comments 
// CRD since editing user comments doesn't make any sense
router.delete('/posts/:postId/comments/:commentId', passport.authenticate('jwt', {session: false}), CommentController.deleteComment);
router.get('/posts/:postId/comments', CommentController.getComments);
router.post('/posts/:postId/comments', CommentController.createComment);
// posts
router.put('/posts/:id', passport.authenticate('jwt', {session: false}), PostController.updatePost);
router.delete('/posts/:id', passport.authenticate('jwt', {session: false}), PostController.deletePost);
router.get('/posts/:id', PostController.getPost);
router.get('/posts', PostController.getPosts);
router.post('/posts', passport.authenticate('jwt', {session: false}), PostController.createPost);
// users
router.post('/register', passport.authenticate('jwt', {session: false}), UserController.createUser);

router.post('/login', UserController.loginUser);

router.get('/protected', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        message: 'You have entered the protected route!'
    });
});

module.exports = router;