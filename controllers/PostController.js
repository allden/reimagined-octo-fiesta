const Post = require('../models/PostModel');
const User = require('../models/UserModel');
const Comment = require('../models/CommentModel');
const jwt = require('jsonwebtoken');

// GET all
module.exports.getPosts = (req, res) => {
    const search = req.query.search ? `.*${req.query.search}.*` : '.*';
    const { limit, skip } = req.query;
    Post.find({title: new RegExp(search, "is")})
    .limit(Number(limit))
    .skip(Number(skip))
    .sort({timeOfCreation: -1})
    .exec((err, posts) => {
        if(err) {
            errorHandling(err, res);
        }
        return res.json({posts});
    })
};

// POST
module.exports.createPost = (req, res) => {
    const secret = process.env.SECRET_KEY;
    let bearer = req.headers.authorization;
    let bearerToken = bearer.split(' ')[1];
    let {title, content, published} = req.body;

    if(!content || !title) {
        return res.status(403).json({
            message: 'Please include both a title and the post content.'
        });
    };

    jwt.verify(bearerToken, secret, (err, decoded) => {
        if(err) {
            return res.status(500).json({message: 'Something went wrong.'});
        };

        User.findById({_id: decoded.id})
        .then(user => {
            new Post({
                author: user.getFullName,
                title,
                content,
                published
            }).save()
            .then(post => {
                return res.json({
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
    .then(post => {
        if(post) {
            return res.json({ post });
        } else {
            return res.status(404).json({
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
                    return res.json({
                        message: 'Successfully deleted.',
                        deletedPost
                    });
                })
                .catch(err => errorHandling(err, res));
            })
            .catch(err => errorHandling(err, res));
            
        } else {
            return res.status(404).json({
                message: "Not found."
            });
        };
    })
    .catch(err => errorHandling(err, res));
};

// PUT
module.exports.updatePost = (req, res) => {
    let id = req.params.id;
    let { title, content, published } = req.body;

    Post.findById({_id: id})
    .then(post => {
        if(post) {
            if(!title) title = post.title;
            if(!content) content = post.content;
            if(!published) published = post.published;
            Post.findByIdAndUpdate({_id: id}, {title, content, published})
            .then(updatedPost => {
                return res.json({
                    message: 'Updated successfully',
                    updatedPost
                });
            })
            .catch(err => errorHandling(err, res));
        } else {
            return res.status(404).json({
                message: "Not found."
            });
        };
    })
    .catch(err => errorHandling(err, res));
};

function errorHandling(err, res) {
    console.error(err);
    return res.status(500).json({message: 'Something went wrong.'});
};