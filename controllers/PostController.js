const Post = require('../models/PostModel');
const User = require('../models/UserModel');
const Comment = require('../models/CommentModel');
const jwt = require('jsonwebtoken');

// GET all
module.exports.getPosts = (req, res) => {
    Post.find({})
    .populate('author')
    .exec()
    .then(posts => {
        res.json(posts);
    })
    .catch(err => errorHandling(err, res));
};

// POST
module.exports.createPost = (req, res) => {
    const secret = process.env.SECRET_KEY;
    let bearer = req.headers.authorization;
    let bearerToken = bearer.split(' ')[1];
    let {content, published} = req.body;

    if(!content) {
        res.status(403).json({
            message: 'Post body cannot be empty!'
        });
    };

    jwt.verify(bearerToken, secret, (err, decoded) => {
        if(err) {
            res.status(500).json({message: 'Something went wrong.'});
        };

        User.findById({_id: decoded.id})
        .then(user => {
            new Post({
                author: user._id,
                content,
                published
            }).save()
            .then(post => {
                res.json({
                    message: 'Post created',
                    post
                });
            })
            .catch(err => errorHandling(err, res));
        })
        .catch(err => errorHandling(err, res))
    });
};

// GET SPECIFIC
module.exports.getPost = (req, res) => {
    let id = req.params.id;

    Post.findById({_id: id})
    .populate('author')
    .exec()
    .then(post => {
        if(post) {
            res.json({ post });
        } else {
            res.json({
                message: "Not found."
            });
        };
    })
    .catch(err => errorHandling(err, res));
};

// DELETE
module.exports.deletePost = (req, res) => {
    let id = req.params.id;

    Post.findById({_id: id})
    .then(post => {
        if(post) {
            Post.findByIdAndDelete({_id: id})
            .then(deletedPost => {
                Comment.deleteMany({forPost: id})
                .then(deletedComments => {
                    res.json({
                        message: 'Successfully deleted.',
                        deletedPost
                    });
                })
                .catch(err => errorHandling(err, res));
            })
            .catch(err => errorHandling(err, res));
            
        } else {
            res.json({
                message: "Not found."
            });
        };
    })
    .catch(err => errorHandling(err, res));
};

// PUT
module.exports.updatePost = (req, res) => {
    let id = req.params.id;
    let { content, published } = req.body;

    Post.findById({_id: id})
    .then(post => {
        if(post) {
            Post.findByIdAndUpdate({_id: id}, {content, published})
            .then(updatedPost => {
                res.json({
                    message: 'Updated successfully',
                    updatedPost
                });
            })
            .catch(err => errorHandling(err, res));
        } else {
            res.json({
                message: "Not found."
            });
        };
    })
    .catch(err => errorHandling(err, res));
};

function errorHandling(err, res) {
    console.error(err);
    res.status(500).json({message: 'Something went wrong.'});
};