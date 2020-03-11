const Comment = require('../models/CommentModel');

// GET all for specific post
module.exports.getComments = (req, res) => {
    const { postId } = req.params;
    const { limit, skip } = req.query;

    Comment.find({forPost: postId})
    .limit(Number(limit))
    .skip(Number(skip))
    .sort({timeOfCreation: -1})
    .exec()
    .then(comments => {
        return res.json({comments});
    })
    .catch(err => errorHandling(err, res));
};

// POST
module.exports.createComment = (req, res) => {
    let { postId } = req.params;
    let { content, name } = req.body;

    if(!content || !name) {
        return res.status(403).json({
            message: "Please fill in the content and name field."
        })
    };

    if(!postId) {
        return res.status(500).json({
            message: "Something went wrong!"
        });
    };

    new Comment({
        content,
        postedBy: name,
        forPost: postId
    }).save()
    .then(comment => {
        return res.json({
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
                return res.json({
                    message: "Successfully deleted.",
                    deletedComment
                });
            })
            .catch(err => errorHandling(err, res));
        } else {
            return res.status(404).json({
                message: "Not found"
            });
        };
    })
    .catch(err => errorHandling(err, res));
};

function errorHandling(err, res) {
    console.error(err);
    return res.status(500).json({message: 'Something went wrong.'});
};