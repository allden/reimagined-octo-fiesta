const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = {toJSON: { virtuals: true }};

const CommentSchema = new Schema({
    content: String,
    postedBy: String,
    timeOfCreation: {
        type: Date, 
        default: Date.now()
    },
    forPost: {
        type: Schema.Types.ObjectId, 
        ref: 'Post',
        required: true
    }
}, opts);

CommentSchema.virtual('url').get(function() {
    return '/posts/' + this.forPost + '/comments/' + this._id;
});

module.exports = mongoose.model('Comment', CommentSchema);