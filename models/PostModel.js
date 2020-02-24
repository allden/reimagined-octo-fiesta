const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = { toJSON: {virtuals: true}};

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    content: {
        type: String, 
        required: true
    },
    timeOfCreation: {
        type: Date, 
        default: Date.now()
    },
    published: {
        type: Boolean, 
        default: false
    },
    approvalRating: {
        type: Number, 
        default: 0
    }
}, opts);

PostSchema.virtual('url').get(function() {
    return '/posts/' + this._id;
});

module.exports = mongoose.model('Post', PostSchema);