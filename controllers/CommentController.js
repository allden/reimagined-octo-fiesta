const Comment = require('../models/CommentModel');

// GET all for specific post
module.exports.getComments = (req, res) => {
    let { postId } = req.params;

    Comment.find({forPost: postId})
    .then(comments => {
        res.json({comments});
    })
    .catch(err => errorHandling(err, res));
};

// POST
module.exports.createComment = (req, res) => {
    let { postId } = req.params;
    let { content, name } = req.body;

    if(!content || !name) {
        res.status(403).json({
            message: "Please fill in the content and name field."
        })
    };

    if(!postId) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    };

    new Comment({
        content,
        postedBy: name,
        forPost: postId
    }).save()
    .then(comment => {
        res.json({
            message: "Successfully made a comment.",
            comment
        });
    })
    .catch(err => errorHandling(err, res));
};

// DELETE
module.exports.deleteComment = (req, res) => {
    let { commentId } = req.params;

    Comment.findOne({_id: commentId})
    .then(comment => {
        if(comment) {
            Comment.findByIdAndDelete({_id: commentId})
            .then(deletedComment => {
                res.json({
                    message: "Successfully deleted.",
                    deletedComment
                });
            })
            .catch(err => errorHandling(err, res));
        } else {
            res.status(500).json({
                message: "Not found"
            });
        };
    })
    .catch(err => errorHandling(err, res));
};

function errorHandling(err, res) {
    console.error(err);
    res.status(500).json({message: 'Something went wrong.'});
};